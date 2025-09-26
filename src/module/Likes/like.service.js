import * as wrapper from "@/helpers/utils/wrapper.js";
import { BadRequestError } from "@/helpers/error/index.js";
import { prisma } from "@/helpers/db/prisma.js";

export default class LikeService {
  static async createLike(data) {
    try {
      let like;
      const { username, report_id } = data;

      const user = await prisma.user.findFirst({
        where: {
          username: username
        }
      })
      console.log(username);
      if (user || user.length !== 0) {
        like = await prisma.like.create({
          data: {
            user: {
              connect: { user_id: user.user_id }
            },
            report: {
              connect: { report_id: report_id }
            }
          }
        })

        const report = await prisma.report.update({
          where: {
            report_id: report_id
          },
          data: {
            likesCount: {
              increment: 1
            }
          }
        });

        if (!like || like.length === 0 || !report) {
          return wrapper.error(new BadRequestError("No likes created"));
        }
      }

      return wrapper.data(like);
    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }

  static async deleteLike(data) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username: data.username
        }
      })

      const like = await prisma.like.delete({
        where: {
          user_id_report_id: {
            user_id: user.user_id,
            report_id: data.report_id
          }
        }
      });
      const report = await prisma.report.update({
        where: {
          report_id: data.report_id
        },
        data: {
          likesCount: {
            decrement: 1
          }
        }
      });
      if (!like || !report) {
        return wrapper.error(new BadRequestError("No like found."));
      }

      return wrapper.data(like);
    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }

  static async getLikesCount(report_id, username) {
    try {
      const reportId = Number(report_id);

      if (!reportId) {
        return wrapper.error(new BadRequestError("report_id is required"));
      }

      const report = await prisma.report.findUnique({
        where: { report_id: reportId },
        select: { likesCount: true }
      });

      if (!report) {
        return wrapper.error(new BadRequestError("Report not found"));
      }

      let isLikedByUser = false;

      if (username) {
        const user = await prisma.user.findUnique({
          where: { username }
        });

        if (user) {
          const userLike = await prisma.like.findUnique({
            where: {
              user_id_report_id: {
                user_id: user.user_id,
                report_id: reportId
              }
            }
          });
          console.log("user_id : ", user.user_id);
          isLikedByUser = !!userLike;
          console.log(isLikedByUser);
        }
      }

      return wrapper.data({
        likesCount: report.likesCount,
        isLikedByUser
      });
    } catch (err) {
      return wrapper.error(new BadRequestError(err.message));
    }
  }
}