import * as wrapper from "@/helpers/utils/wrapper.js";
import { BadRequestError } from "@/helpers/error/index.js";
import { prisma } from "@/helpers/db/prisma.js";

export default class CommentService {
    static async  createComment(data) {
        try {
        let comment;
        const { username, report_id, content } = data;
        
        const user = await prisma.user.findFirst({
            where: {
                username: username
            }
        })
        if(user || user.length !== 0){
            comment = await prisma.comment.create({
                data: {
                    user: {
                        connect: { user_id: user.user_id }
                    },
                    report: {
                        connect: { report_id: report_id }
                    },
                    content: content
                }
            });
            
            if (!comment || comment.length === 0) {
                return wrapper.error(new BadRequestError("No comments created"));
            }
        }
        return wrapper.data(comment);
        } catch (err) {
        return wrapper.error(new BadRequestError(err.message));
        }
    }

    static async deleteComment(data) {
        try {
        let comment;
        const {report_id, username} = data;
        const user = await prisma.user.findFirst({
            where: {
                username: username
            }
        })
        if(user || user.length !== 0){
            comment = await prisma.comment.delete({
                where: {
                    user_id_report_id: {
                        user_id: user.user_id,
                        report_id: report_id
                    }
                }
            });
            
            if (!comment || comment.length === 0) {
                return wrapper.error(new BadRequestError("No comment found"));
            }
        }

        return wrapper.data(comment);
        } catch (err) {
        return wrapper.error(new BadRequestError(err.message));
        }
    }
}