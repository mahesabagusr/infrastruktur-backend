import joi from 'joi';

export const createLikeSchema = joi.object({
    user_id: joi.int().required().messages({
        'number.base': 'User ID harus berupa angka.',
        'any.required': 'User ID wajib diisi.',
    }),
    report_id: joi.int().required().messages({
        'number.base': 'Report ID harus berupa angka.',
        'any.required': 'Report ID wajib diisi.',
    }),
});