import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import * as wrapper from "@/helpers/utils/wrapper.js";
import { createToken } from "@/middlewares/jwt_auth.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/helpers/error/index.js";
import { prisma } from "@/helpers/db/prisma.js";
import uploadToCloudinary from "@/module/utils/image-upload.js";

export default class UserService {
  static async addReport(payload) {
    try {
      console.log(payload)
      const { title, description, latitude, longitude, address, email, image } = payload;

      const uploadResult = await uploadToCloudinary(image);

      if (!uploadResult) {
        return wrapper.error(new BadRequestError("Image upload failed"));
      }

      const imageUrl = uploadResult.secure_url;

      const author = await prisma.user.findFirst({
        where: {
          email: email,
        },
      })

      console.log(author);

      const newReport = await prisma.report.create({
        data: {
          title,
          description,
          latitude,
          longitude,
          address,
          author_id: author.user_id,
          photoUrl: imageUrl,
        }
      })

      if (!newReport) {
        return wrapper.error(new BadRequestError("Failed to create report"));
      }

      return wrapper.data(newReport);

    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }
}