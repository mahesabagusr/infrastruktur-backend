import joi from 'joi';

export const likeSchema = joi.object({
    username: joi.string().required().messages({
        'string.base': 'User ID harus berupa huruf dan angka',
        'any.required': 'User ID wajib diisi.',
    }),
    report_id: joi.number().required().messages({
        'number.base': 'Report ID harus berupa angka.',
        'any.required': 'Report ID wajib diisi.',
    }),
});

