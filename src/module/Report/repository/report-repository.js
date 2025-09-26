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

  static async findAllReports({ offset, limit, stage, status, userId, weekly, like, latest, provinceId, regencyId, today }) {
    const where = {};
    const now = new Date();
    const startOfToday = new Date(now);

    if (provinceId && regencyId) {
      where.address = {
        is: {
          province_id: Number(provinceId) || 0,
          regency_id: Number(regencyId) || 0,
        }
      };
    }

    if (stage) {
      where.progressUpdates = { some: { stage } };
    }
    if (status) {
      where.verification_status = status;
    }
    if (userId) {
      where.author_id = parseInt(userId);
    }
    if (today) {
      startOfToday.setHours(0, 0, 0, 0)
      where.createdAt = {
        gte: startOfToday,
        lte: now,
      }
    }

    if (weekly) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);

      where.createdAt = { gte: sevenDaysAgo };
    }
    if (provinceId || regencyId) {
      where.address = {};
      if (provinceId) where.address.province_id = parseInt(provinceId);
      if (regencyId) where.address.regency_id = parseInt(regencyId);
    }

    return prisma.report.findMany({
      skip: offset,
      take: limit,
      where,
      orderBy: [
        like ? { likesCount: 'desc' } : undefined,
        latest ? { createdAt: 'desc' } : undefined
      ].filter(Boolean),
      select: {
        report_id: true,
        title: true,
        description: true,
        verification_status: true,
        verification_notes: true,
        photoUrl: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { username: true } },
        address: {
          select: {
            street: true,
            province: { select: { name: true, province_id: true } },
            regency: { select: { name: true, regency_id: true } },
          }
        },
        likes: true,
        comments: true,
        _count: { select: { progressUpdates: true } },
        progressUpdates: {
          orderBy: { createdAt: 'desc' },
          select: {
            report_progress_id: true,
            stage: true,
            createdAt: true,
          }
        }
      }
    });
  }

  static async countReportsByProgress(stage) {
    return prisma.report_progress.count({
      where: {
        stage: stage,
      }
    });
  }

  static async countAllReports({ stage, status, userId, provinceId, regencyId }) {
    const where = {};



    if (stage) {
      where.progressUpdates = { some: { stage } }
    };
    if (status) {
      where.verification_status = status;
    }
    if (userId) {
      where.author_id = parseInt(userId);
    }

    if (provinceId || regencyId) {
      where.address = {};
      if (provinceId) where.address.province_id = parseInt(provinceId);
      if (regencyId) where.address.regency_id = parseInt(regencyId);
    }

    return prisma.report.count({ where });
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
        photoUrl: true,
        createdAt: true,
        address: {
          select: {
            street: true,
            latitude: true,
            longitude: true,
            province: { select: { province_id: true, name: true } },
            regency: { select: { regency_id: true, name: true } },
          }
        },
        _count: { select: { progressUpdates: true } },
        progressUpdates: {
          orderBy: { createdAt: 'asc' },
          select: {
            report_progress_id: true,
            progress_notes: true,
            stage: true,
            createdAt: true,
            reviewer: {
              select: {
                username: true,
              }
            },
            photo_url: true,
          }
        }
      }
    });
  }

  static findReportProgressById(progressId) {
    return prisma.report_progress.findUnique({
      where: {
        report_progress_id: parseInt(progressId),
      }
    });
  }

}