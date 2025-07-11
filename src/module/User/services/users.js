import { Op } from "sequelize";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import User from "../models/users"; 
import * as wrapper from "../helpers/utils/wrapper"; 
import { createToken } from "../middlewares/jwt"; 
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../helpers/error"; 

export default class UserService {
  static async register(payload) {
    try {
      const { username, email, password } = payload;

      const existingUser = await User.findOne({
        where: { [Op.or]: [{ email }, { username }] },
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

      await User.create({
        username,
        email,
        password: hashPassword,
        signature: signature,
      });

      return wrapper.data("User registered successfully.");
    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }


  static async login(payload) {
    try {
      const { identifier, password } = payload;

      const user = await User.findOne({
        where: {
          [Op.or]: [{ username: identifier }, { email: identifier }],
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