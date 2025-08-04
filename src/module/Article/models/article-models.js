import Joi from 'joi';

// Model for creating a new article
const articleModel = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.base': 'Judul harus berupa teks.',
    'string.empty': 'Judul tidak boleh kosong.',
    'string.min': 'Judul minimal harus memiliki {#limit} karakter.',
    'string.max': 'Judul maksimal harus memiliki {#limit} karakter.',
    'any.required': 'Judul wajib diisi.',
  }),
  content: Joi.string().min(10).required().messages({
    'string.base': 'Konten harus berupa teks.',
    'string.empty': 'Konten tidak boleh kosong.',
    'string.min': 'Konten minimal harus memiliki {#limit} karakter.',
    'any.required': 'Konten wajib diisi.',
  }),
  categoryId: Joi.string().required().messages({
    'string.base': 'Kategori harus berupa teks.',
    'string.empty': 'Kategori tidak boleh kosong.',
    'any.required': 'Kategori wajib diisi.',
  }),
  slug: Joi.string().pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).min(3).max(100).required().messages({
    'string.base': 'Slug harus berupa teks.',
    'string.empty': 'Slug tidak boleh kosong.',
    'string.pattern.base': 'Slug hanya boleh berisi huruf kecil, angka, dan tanda minus.',
    'string.min': 'Slug minimal harus memiliki {#limit} karakter.',
    'string.max': 'Slug maksimal harus memiliki {#limit} karakter.',
    'any.required': 'Slug wajib diisi.',
  }),
  image: Joi.string().uri().required().messages({
    'string.base': 'Image harus berupa teks.',
    'string.empty': 'Image tidak boleh kosong.',
    'string.uri': 'Image harus berupa URL yang valid.',
    'any.required': 'Image wajib diisi.',
  }),
});

// Model for verifying an article
const verifyArticleModel = Joi.object({
  status: Joi.string().valid('verified', 'rejected').required().messages({
    'string.base': 'Status harus berupa teks.',
    'any.only': 'Status harus salah satu dari: verified, rejected.',
    'any.required': 'Status wajib diisi.',
  }),
  note: Joi.string().allow('').optional().messages({
    'string.base': 'Catatan harus berupa teks.',
  }),
});

// Model for creating article progress
const createArticleSchema = Joi.object({
  progress: Joi.string().min(3).required().messages({
    'string.base': 'Progress harus berupa teks.',
    'string.empty': 'Progress tidak boleh kosong.',
    'string.min': 'Progress minimal harus memiliki {#limit} karakter.',
    'any.required': 'Progress wajib diisi.',
  }),
  description: Joi.string().min(10).required().messages({
    'string.base': 'Deskripsi harus berupa teks.',
    'string.empty': 'Deskripsi tidak boleh kosong.',
    'string.min': 'Deskripsi minimal harus memiliki {#limit} karakter.',
    'any.required': 'Deskripsi wajib diisi.',
  }),
});

// Export Joi schemas for validation
export {
  articleModel,
  verifyArticleModel,
  createArticleSchema,
};