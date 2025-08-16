import * as wrapper from "@/helpers/utils/wrapper.js";
import { BadRequestError, NotFoundError } from "@/helpers/error/index.js";
import uploadToCloudinary from "@/module/utils/image-upload.js";

import ReportRepository from "@/module/Report/repository/report-repository.js";
import UserRepository from "@/module/User/repository/user-repository.js";

export default class ReportService {
  static async addReport(payload) {
    try {
      const { title, description, latitude, longitude, street, provinceId, regencyId, email, image } = payload;
      console.log(email)
      const author = await UserRepository.findUserByEmailOrUsername(email);
      console.log(author)
      if (!author) {
        return wrapper.error(new BadRequestError("User tidak ditemukan"));
      }

      const uploadResult = await uploadToCloudinary(image);
      if (!uploadResult) {
        return wrapper.error(new BadRequestError("Image upload failed"));
      }
      const imageUrl = uploadResult.secure_url;

      const newReport = await ReportRepository.createReport({
        title, description, street, longitude, latitude, provinceId, regencyId,
        authorId: author.user_id,
        imageUrl,
      });

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

      const updatedReport = await ReportRepository.updateReportVerification(reportId, {
        verification_status,
        verification_notes,
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
      const { progressNotes: progress_notes, stage, email, image, reportId } = payload;

      const author = await UserRepository.findUserByEmailOrUsername(email);
      if (!author) {
        return wrapper.error(new BadRequestError("User tidak ditemukan"));
      }

      const uploadResult = await uploadToCloudinary(image);
      if (!uploadResult) {
        return wrapper.error(new BadRequestError("Gagal mengunggah gambar"));
      }
      const imageUrl = uploadResult.secure_url;

      const newReportProgress = await ReportRepository.createReportProgress({
        progress_notes,
        stage,
        reviewer_id: author.user_id,
        reportId,
        photo_url: imageUrl,
      });

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
      const reports = await ReportRepository.findAllReports();
      if (!reports || reports.length === 0) {
        return wrapper.error(new NotFoundError("Laporan tidak ditemukan"));
      }
      return wrapper.data(reports);
    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }

  static getAllReportsByProvince = async (province) => {
    try {
      const reports = await ReportRepository.findReportsByProvince(province);
      if (!reports || reports.length === 0) {
        return wrapper.error(new NotFoundError("Laporan tidak ditemukan untuk provinsi ini"));
      }
      return wrapper.data(reports);
    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }

  static getReportById = async (reportId) => {
    try {
      const report = await ReportRepository.findReportById(reportId);
      if (!report) {
        return wrapper.error(new NotFoundError("Laporan tidak ditemukan"));
      }
      return wrapper.data(report);
    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }

  static getReportsByProgress = async (stage) => {
    try {
      console.log("Tes")
      const reports = await ReportRepository.findReportsByProgress(stage);
      if (!reports || reports.length === 0) {
        return wrapper.error(new NotFoundError("Laporan tidak ditemukan untuk tahap ini"));
      }
      return wrapper.data(reports);

    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }
}