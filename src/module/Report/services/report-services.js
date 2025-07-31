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

      const author = await prisma.user.findFirst({
        where: {
          email: email,
        },
        select: {
          user_id: true,
        },
      })

      const uploadResult = await uploadToCloudinary(image);

      if (!uploadResult) {
        return wrapper.error(new BadRequestError("Image upload failed"));
      }

      const imageUrl = uploadResult.secure_url;

      const newReport = await prisma.report.create({
        data: {
          title,
          description,
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

  static async verifyReport(payload) {
    try {
      const { reportId, verificationStatus, verificationNotes } = payload;

      const updatedReport = await prisma.report.update({
        where: {
          report_id: reportId,
        },
        data: {
          verificationStatus,
          verificationNotes,
        }
      });

      if (!updatedReport) {
        return wrapper.error(new BadRequestError("Failed to update report"));
      }

      return wrapper.data(updatedReport);

    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }

  static async addReportProgress(payload) {
    try {
      const { progressNotes, stage, email, image, reportId, } = payload

      const author = await prisma.user.findFirst({
        where: {
          email: email,
        },
        select: {
          user_id: true,
        },
      })

      if (!author) {
        return wrapper.error(new BadRequestError("User tidak ditemukan"));
      }

      const uploadResult = await uploadToCloudinary(image);

      if (!uploadResult) {
        return wrapper.error(new BadRequestError("Gagal mengunggah gambar"));
      }

      const imageUrl = uploadResult.secure_url;

      const newReportProgress = await prisma.reportProgress.create({
        data: {
          progressNotes,
          stage,
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