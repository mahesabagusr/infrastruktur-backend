import { prisma } from "@/helpers/db/prisma.js";

export default class ReportRepository {
  static async createReport(reportData) {
    const { title, description, street, longitude, latitude, provinceId, regencyId, authorId, imageUrl } = reportData;
    return prisma.report.create({
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
        author_id: authorId,
        photoUrl: imageUrl,
      }
    });
  }

  static async updateReportVerification(reportId, verificationData) {
    const { verification_status, verification_notes } = verificationData;
    return prisma.report.update({
      where: {
        report_id: parseInt(reportId),
      },
      data: {
        verification_status,
        verification_notes,
      }
    });
  }

  static async createReportProgress(progressData) {
    const { progress_notes, stage, reviewer_id, reportId, photo_url } = progressData;
    return prisma.report_progress.create({
      data: {
        progress_notes,
        stage,
        reviewer_id,
        report_id: parseInt(reportId),
        photo_url,
      }
    });
  }

  static async findAllReports(offset = 0, limit = 10) {
    return prisma.report.findMany({
      skip: offset,
      take: limit,
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
        verification_status: true,
        verification_notes: true,
        photoUrl: true,
      }
    })
  }

  static async countReportsByProgress(stage) {
    return prisma.report_progress.count({
      where: {
        stage: stage,
      }
    });
  }

  static async countAllReports() {
    return prisma.report.count();
  }

  static async findReportsByProvince(provinceId) {
    return prisma.report.findMany({
      where: {
        address: {
          province_id: parseInt(provinceId),
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
  }

  static async findReportById(reportId) {
    return prisma.report.findUnique({
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
    });
  }

  static async findReportsByProgress(stage) {
    return prisma.report_progress.findMany({
      where: {
        stage: stage,
      },
      select: {
        report_id: true,
        progress_notes: true,
        stage: true,
        photo_url: true,
        reviewer: {
          select: {
            username: true,
            role: true,
          }
        },
      }
    })
  }
}