import * as wrapper from '@/helpers/utils/wrapper.js';
import {
    ERROR as httpError,
    SUCCESS as http,
} from '@/helpers/http-status/status_code.js'

import { isValidPayload } from '@/helpers/utils/validator.js';
import logger from '@/helpers/utils/logger.js';
import LikeService from '@/module/Likes/like.service.js';
import { likeSchema } from './like.schema.js';

const createLike = async (req, res) => {
    try {

        let payload = { ...req.body, username: req.user.username };

        const validatePayload = isValidPayload(payload, likeSchema);
        if (validatePayload.err) {
            return wrapper.response(
                res,
                "fail",
                { err: validatePayload.err, data: null },
                "Invalid Payload",
                httpError.EXPECTATION_FAILED
            );
        }


        const result = await LikeService.createLike(validatePayload.data);

        if (result.err) {
            return wrapper.response(
                res,
                "fail",
                { err: result.err, data: null },
                "Failed to create Like",
                httpError.INTERNAL_ERROR
            );
        }
        return wrapper.response(res, "success", { data: result }, "Like created successfully", http.CREATED);

    } catch (error) {
        logger.error(`Unexpected error during create Like: ${error.message}`);
        return wrapper.response(
            res,
            "fail",
            { err: error.message, data: null },
            "An unexpected error occurred",
            httpError.INTERNAL_ERROR
        );

    }
}

const deleteLike = async (req, res) => {
    try {
        const payload = { report_id: parseInt(req.params.id, 10), username: req.user.username }

        const validatePayload = isValidPayload(payload, likeSchema);
        if (validatePayload.err) {
            return wrapper.response(
                res,
                "fail",
                { err: validatePayload.err, data: null },
                "Invalid Payload",
                httpError.EXPECTATION_FAILED
            );
        }

        const result = await LikeService.deleteLike(payload);

        if (result.err) {
            return wrapper.response(
                res,
                "fail",
                { err: result.err, data: null },
                "Failed to delete Like",
                httpError.INTERNAL_ERROR
            );
        }

        return wrapper.response(res, "success", { data: result }, "Like deleted successfully", http.OK);

    } catch (error) {
        logger.error(`Unexpected error during delete Like: ${error.message}`);
        return wrapper.response(
            res,
            "fail",
            { err: error.message, data: null },
            "An unexpected error occurred",
            httpError.INTERNAL_ERROR
        );

    }
}

export {
    createLike,
    deleteLike
}