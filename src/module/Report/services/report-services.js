import * as wrapper from "@/helpers/utils/wrapper.js";
import {
  BadRequestError,
  NotFoundError,
} from "@/helpers/error/index.js";
import { prisma } from "@/helpers/db/prisma.js";
import uploadToCloudinary from "@/module/utils/image-upload.js";

export default class ReportService {
  static async addReport(payload) {
    try {

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
            create: {
              street,
              longitude,
              latitude,
              province_id: provinceId,
              regency_id: regencyId,
            }
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
      const { reportId, verificationStatus: verification_status, verificationNotes: verification_notes } = payload;

      const updatedReport = await prisma.report.update({
        where: {
          report_id: parseInt(reportId),
        },
        data: {
          verification_status,
          verification_notes,
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
      const { progressNotes: progress_notes, stage, email, image, reportId, } = payload

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

      const newReportProgress = await prisma.report_progress.create({
        data: {
          progress_notes,
          stage,
          reviewer_id: author.user_id,
          report_id: parseInt(reportId),
          photo_url: imageUrl,
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

  static getAllReport = async () => {
    try {

      const reports = await prisma.report.findMany({
        select: {
          report_id: true,
          title: true,
          description: true,
          verification_status: true,
          verification_notes: true,
          address: {
            select: {
              street: true,
              latitude: true,
              longitude: true,
              province_id: true,
              regency_id: true,
            }
          },
        }
      })

      if (!reports) {
        return wrapper.error(new NotFoundError("Laporan tidak ditemukan"));
      }

      return wrapper.data(reports);

    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }

  static getAllReportsByProvince = async (province) => {
    try {
      const reports = await prisma.report.findMany({
        where: {
          address: {
            province_id: parseInt(province),
          }
        },
        select: {
          report_id: true,
          title: true,
          description: true,
          address: {
            select: {
              street: true,
              latitude: true,
              longitude: true,
              province_id: true,
              regency_id: true,
            }
          },
        }
      });

      if (!reports) {
        return wrapper.error(new NotFoundError("Laporan tidak ditemukan untuk provinsi ini"));
      }

      return wrapper.data(reports);

    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }

  static getReportById = async (reportId) => {
    try {

      const report = await prisma.report.findUnique({
        where: {
          report_id: parseInt(reportId),
        },
        select: {
          report_id: true,
          title: true,
          description: true,
          verification_status: true,
          verification_notes: true,
          address: {
            select: {
              street: true,
              latitude: true,
              longitude: true,
              province_id: true,
              regency_id: true,
            }
          },
          photoUrl: true,
        }
      })

      if (!report) {
        return wrapper.error(new NotFoundError("Laporan tidak ditemukan"));
      }

      return wrapper.data(report);

    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }
}

