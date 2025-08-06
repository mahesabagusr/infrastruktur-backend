import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import * as wrapper from "@/helpers/utils/wrapper.js";
import { createRefreshToken, createToken, verifyRefreshToken } from "@/middlewares/jwt-auth.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/helpers/error";
import { prisma } from "@/helpers/db/prisma.js";

export default class UserService {
  static async register(payload) {
    try {
      const { username, email, password, firstName, phoneNumber, lastName, street, provinceId, regencyId } = payload;

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email },
            { username: username },
          ],
        },
      });

      if (existingUser) {
        const message =
          existingUser.email === email
            ? "Email is already in use."
            : "Username is already taken.";

        return wrapper.error(new UnauthorizedError(message));
      }

      const signature = nanoid(4);
      const hashPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          username,
          firstname: firstName,
          lastname: lastName,
          email,
          password: hashPassword,
          signature: signature,
          phone_number: phoneNumber,
          address: {
            create: {
              street: street,
              province_id: provinceId,
              regency_id: regencyId,
            }
          }
        },
      });

      return wrapper.data("User registered successfully.");

    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }

  static async login(payload) {
    try {
      const { identifier, password } = payload;

      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { username: identifier },
            { email: identifier }
          ],
        },
      });

      if (!user) {
        return wrapper.error(new NotFoundError("User not found."));
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return wrapper.error(new UnauthorizedError("Incorrect password."));
      }

      const { accessToken } = createToken(user);
      const { refreshToken } = createRefreshToken(user);

      await prisma.refresh_token.create({
        data: {
          token: refreshToken,
          user_id: user.user_id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      })

      return wrapper.data({ token: accessToken, refreshToken });

    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }

  static async refreshToken(token) {
    try {
      const { error } = verifyRefreshToken(token)

      if (error) {
        return wrapper.error(new UnauthorizedError("Invalid refresh token."));
      }

      const activeToken = await prisma.refresh_token.findFirst({
        where: { token: token },
        include: { user: true }
      });

      if (!activeToken) {
        return wrapper.error(new NotFoundError("Token is valid, but no longer active. Please log in again."));
      }

      await prisma.refresh_token.delete({
        where: { id: activeToken.id }
      });

      const { accessToken } = createToken(activeToken.user)
      const { refreshToken } = createRefreshToken(activeToken.user)

      await prisma.refresh_token.create({
        data: {
          token: refreshToken,
          user_id: activeToken.user.user_id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        }
      });

      return wrapper.data({ token: accessToken, refreshToken })

    } catch (err) {
      return wrapper.error(new UnauthorizedError("Refresh token verification failed : " + err.message));
    }
  }

  static async logout(token) {
    try {
      await prisma.refresh_token.deleteMany({
        where: {
          token: token,
        },
      });

      return wrapper.data("Logout successful.");

    } catch (err) {

      return wrapper.error(new BadRequestError(err.message));
    }
  }
}