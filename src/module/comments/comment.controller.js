import * as wrapper from '@/helpers/utils/wrapper.js';
import {
  ERROR as httpError,
  SUCCESS as http,
} from '@/helpers/http-status/status_code.js'

import { isValidPayload } from '@/helpers/utils/validator.js';
import logger from '@/helpers/utils/logger.js';
import CommentService from '@/module/comments/comment.service.js';
import { createCommentSchema } from './comment.schema';
const createComment = async (req, res) => {
    try {
        let payload = { ...req.body, user_id: req.user.id };
        const validatePayload = isValidPayload(payload, createCommentSchema);

            if (validatePayload.err) {
                return wrapper.response(
                    res,
                    "fail",
                    { err: validatePayload.err, data: null },
                    "Invalid Payload",
                    httpError.EXPECTATION_FAILED
                );
            }
        const result = await CommentService.createComment(validatePayload);

        if(result.err){
            return wrapper.response(
                res,
                "fail",
                { err: result.err, data: null },
                "Failed to create Like",
                httpError.INTERNAL_ERROR
            );
        }
        return wrapper.response(res, "success", { data: result }, "Comment created successfully", http.CREATED);

    } catch (error) {
        logger.error(`Unexpected error during create Comment: ${error.message}`);
        return wrapper.response(
            res,
            "fail",
            { err: error.message, data: null },
            "An unexpected error occurred",
            httpError.INTERNAL_ERROR
        );
        
    }
}

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await CommentService.deleteComment(id);

        if (result.err) {
            return wrapper.response(
                res,
                "fail",
                { err: result.err, data: null },
                "Failed to delete Like",
                httpError.INTERNAL_ERROR
            );
        }

        return wrapper.response(res, "success", { data: result }, "Comment deleted successfully", http.OK);

    } catch (error) {
        logger.error(`Unexpected error during delete Comment: ${error.message}`);
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
    createComment,
    deleteComment
}