import * as wrapper from "@/helpers/utils/wrapper.js";
import { BadRequestError } from "@/helpers/error/index.js";
import { prisma } from "@/helpers/db/prisma";

export default class CommentService {
    static async  createComment(data) {
        try {
        const { user_id, report_id, content } = data;
        const comment = prisma.comment.create({
            data: {
                user_id,
                report_id,
                content
            }
        });

        if (!comment || comment.length === 0) {
            return wrapper.error(new BadRequestError("No comments created"));
        }

        return wrapper.data(comment);
        } catch (err) {
        return wrapper.error(new BadRequestError(err.message));
        }
    }

    static async deleteComment(data) {
        try {
        const comment = prisma.comment.delete({
            where: {
                id: data.id,
                report_id: data.report_id
            }
        })
        if (!comment) {
            return wrapper.error(new BadRequestError("No comment found."));
        }

        return wrapper.data(comment);
        } catch (err) {
        return wrapper.error(new BadRequestError(err.message));
        }
    }
}