import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import * as wrapper from "@/helpers/utils/wrapper.js";
import { createRefreshToken, createToken, verifyRefreshToken } from "@/middlewares/jwt-auth.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/helpers/error";
import UserRepository from "@/module/User/repository/user-repository.js";

export default class UserService {
  static async register(payload) {
    try {
      const { username, email, password, firstName, phoneNumber, lastName, street, provinceId, regencyId } = payload;

      const existingUser = await UserRepository.findUserByEmailOrUsername(email);
      if (existingUser) {
        const message =
          existingUser.email === email
            ? "Email is already in use."
            : "Username is already taken.";
        return wrapper.error(new UnauthorizedError(message));
      }

      const signature = nanoid(4);
      const hashPassword = await bcrypt.hash(password, 10);

      await UserRepository.createUser({
        username, email, hashPassword, firstName, lastName, signature, phoneNumber, street, provinceId, regencyId
      });

      return wrapper.data("User registered successfully.");
    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }

  static async login(payload) {
    try {
      const { identifier, password } = payload;

      const user = await UserRepository.findUserByEmailOrUsername(identifier);
      if (!user) {
        return wrapper.error(new NotFoundError("User not found."));
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return wrapper.error(new UnauthorizedError("Incorrect password."));
      }

      const { accessToken } = createToken(user);
      const { refreshToken } = createRefreshToken(user);

      await UserRepository.saveRefreshToken(refreshToken, user.user_id);

      const userData = {
        token: accessToken,
        refreshToken,
        username: user.username,
        email: user.email,
        signature: user.signature,
        role: user.role,
      }

      return wrapper.data(userData);
    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }

  static async refreshToken(token) {
    try {
      const { error } = verifyRefreshToken(token);

      if (error) {
        return wrapper.error(new UnauthorizedError("Invalid refresh token."));
      }

      const activeToken = await UserRepository.findActiveRefreshToken(token);

      if (!activeToken) {
        return wrapper.error(new NotFoundError("Token is valid, but no longer active. Please log in again."));
      }

      await UserRepository.deleteRefreshTokenById(activeToken.id);

      const { accessToken: newAccessToken } = createToken(activeToken.user);
      const { refreshToken: newRefreshToken } = createRefreshToken(activeToken.user);

      await UserRepository.saveRefreshToken(newRefreshToken, activeToken.user.user_id);

      const userData = {
        token: newAccessToken,
        refreshToken: newRefreshToken,
        username: activeToken.user.username,
        email: activeToken.user.email,
        signature: activeToken.user.signature,
        role: activeToken.user.role,
      };
      console.log(userData);
      

      return wrapper.data(userData);
    } catch (err) {
      return wrapper.error(new UnauthorizedError("Refresh token verification failed : " + err.message));
    }
  }

  static async logout(token) {
    try {
      await UserRepository.deleteRefreshTokenByToken(token);
      return wrapper.data("Logout successful.");
    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }

  static async getUser(){
    try {
      const users = await UserRepository.findAllUsers();
      return wrapper.data(users);
    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }

  static async getUserById(userId) {
    try {
      const user = await UserRepository.findUserById(userId);
      if (!user) {
        return wrapper.error(new NotFoundError("User not found."));
      }
      return wrapper.data(user);
    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }
}