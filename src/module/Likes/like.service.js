import * as wrapper from "@/helpers/utils/wrapper.js";
import { BadRequestError } from "@/helpers/error/index.js";
import { prisma } from "@/helpers/db/prisma";

export default class LikeService {
    static async  createLike(data) {
        try {
        const { user_id, report_id, like_id} = data;
        const like = prisma.like.create({
            data: {
                user_id,
                report_id,
                like_id
            }
        });

        if (!like || like.length === 0) {
            return wrapper.error(new BadRequestError("No likes created"));
        }

        return wrapper.data(like);
        } catch (err) {
        return wrapper.error(new BadRequestError(err.message));
        }
    }

    static async deleteLike(data) {
        try {
        const like = prisma.like.delete({
            where: {
                id: data.id,
                report_id: data.report_id
            }
        })
        if (!like) {
            return wrapper.error(new BadRequestError("No like found."));
        }

        return wrapper.data(like);
        } catch (err) {
        return wrapper.error(new BadRequestError(err.message));
        }
    }
}