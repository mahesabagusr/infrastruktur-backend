import * as wrapper from "@/helpers/utils/wrapper.js";
import {
  BadRequestError,
} from "@/helpers/error/index.js";
import { prisma } from "@/helpers/db/prisma.js";
import uploadToCloudinary from "@/module/utils/image-upload.js";

export default class ReportService {
  static async addReport(payload) {
    try {
      console.log(payload)
      const { title, description, latitude, longitude, street, provinceId, regencyId, email, image } = payload;

      const uploadResult = await uploadToCloudinary(image);

      if (!uploadResult) {
        return wrapper.error(new BadRequestError("Image upload failed"));
      }

      const imageUrl = uploadResult.secure_url;

      const author = await prisma.user.findFirst({
        where: {
          email: email,
        },
        select: {
          user_id: true,
        },
      })

      const newReport = await prisma.report.create({
        data: {
          title,
          description,
          latitude,
          longitude,
          address: {
            street,
            longitude,
            latitude,
            province_id: provinceId,
            regency_id: regencyId,
          },
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

  static async addReportProgress(payload) {
    try {
      const { progressNotes, stage, verificationStatus, email, image, reportId, } = payload

      const uploadResult = await uploadToCloudinary(image);

      if (!uploadResult) {
        return wrapper.error(new BadRequestError("Image upload failed"));
      }

      const imageUrl = uploadResult.secure_url;

      const author = await prisma.user.findFirst({
        where: {
          email: email,
        },
        select: {
          user_id: true,
        },
      })

      const newReportProgress = await prisma.reportProgress.create({
        data: {
          progressNotes,
          stage,
          verificationStatus,
          author_id: author.user_id,
          report_id: reportId,
          photoUrl: imageUrl,
        }
      })

      if (!newReportProgress) {
        return wrapper.error(new BadRequestError("Failed to create report progress"));
      }

      return wrapper.data(newReportProgress);

    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }
}