import joi from 'joi';

export const commentSchema = joi.object({
    username: joi.string().required().messages({
        'string.base': 'User ID harus berupa string.',
        'any.required': 'User ID wajib diisi.',
    }),
    report_id: joi.number().required().messages({
        'number.base': 'Report ID harus berupa angka.',
        'any.required': 'Report ID wajib diisi.',
    }),
    content: joi.string().min(1).max(500).required().messages({
        'string.base': 'Konten harus berupa teks.',
        'string.min': 'Konten harus memiliki minimal {#limit} karakter.',
        'string.max': 'Konten harus memiliki maksimal {#limit} karakter.',
        'any.required': 'Konten wajib diisi.',
    }),
});

export const deleteCommentSchema = joi.object({
    username: joi.string().required().messages({
        'string.base': 'User ID harus berupa string.',
        'any.required': 'User ID wajib diisi.',
    }),
    report_id: joi.number().required().messages({
        'number.base': 'Report ID harus berupa angka.',
        'any.required': 'Report ID wajib diisi.',
    }),
})