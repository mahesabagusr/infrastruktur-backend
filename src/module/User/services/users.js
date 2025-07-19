import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import * as wrapper from "@/helpers/utils/wrapper.js";
import { createToken } from "@/middlewares/jwt_auth.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/helpers/error/index.js";
import { PrismaClient } from "generated/prisma/index.js";

const prisma = new PrismaClient();
export default class UserService {
  static async register(payload) {
    try {
      const { username, email, password } = payload;

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
          email,
          password: hashPassword,
          signature: signature,
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

      const { accessToken } = await createToken(user);

      return wrapper.data({ token: accessToken });

    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }
}