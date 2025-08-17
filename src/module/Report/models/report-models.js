
import joi from 'joi';

const progressStageEnum = ['REVIEW', 'INPROGRESS', 'COMPLETED'];

const reportModel = joi.object({
  title: joi.string().min(3).max(100).required().messages({
    'string.base': 'Judul harus berupa teks.',
    'string.empty': 'Judul tidak boleh kosong.',
    'string.min': 'Judul minimal harus memiliki {#limit} karakter.',
    'string.max': 'Judul maksimal harus memiliki {#limit} karakter.',
    'any.required': 'Judul wajib diisi.',
  }),
  description: joi.string().min(10).required().messages({
    'string.base': 'Deskripsi harus berupa teks.',
    'string.empty': 'Deskripsi tidak boleh kosong.',
    'string.min': 'Deskripsi minimal harus memiliki {#limit} karakter.',
    'any.required': 'Deskripsi wajib diisi.',
  }),
  latitude: joi.number().min(-90).max(90).required().messages({
    'number.base': 'Latitude harus berupa angka.',
    'number.min': 'Nilai latitude minimal adalah {#limit}.',
    'number.max': 'Nilai latitude maksimal adalah {#limit}.',
    'any.required': 'Latitude wajib diisi.',
  }),
  longitude: joi.number().min(-180).max(180).required().messages({
    'number.base': 'Longitude harus berupa angka.',
    'number.min': 'Nilai longitude minimal adalah {#limit}.',
    'number.max': 'Nilai longitude maksimal adalah {#limit}.',
    'any.required': 'Longitude wajib diisi.',
  }),
  street: joi.string().min(10).required().messages({
    'string.base': 'Alamat harus berupa teks.',
    'string.empty': 'Alamat tidak boleh kosong.',
    'string.min': 'Alamat minimal harus memiliki {#limit} karakter.',
    'any.required': 'Alamat wajib diisi.',
  }),
  email: joi.string().email().messages({
    'string.empty': 'Harap isi Email',
  }),

  provinceId: joi.number().integer().positive().required().messages({
    'number.base': 'ID Provinsi harus berupa angka.',
    'number.integer': 'ID Provinsi harus berupa bilangan bulat.',
    'number.positive': 'ID Provinsi harus berupa angka positif.',
    'any.required': 'Provinsi wajib dipilih.',
  }),

  regencyId: joi.number().integer().positive().required().messages({
    'number.base': 'ID Kabupaten/Kota harus berupa angka.',
    'number.integer': 'ID Kabupaten/Kota harus berupa bilangan bulat.',
    'number.positive': 'ID Kabupaten/Kota harus berupa angka positif.',
    'any.required': 'Kabupaten/Kota wajib dipilih.',
  }),
});

const verifyReportModel = joi.object({
  verificationStatus: joi.string().valid('PENDING', 'VERIFIED', 'REJECTED').required().messages({
    'string.base': 'Status verifikasi harus berupa teks.',
    'any.only': 'Status verifikasi harus salah satu dari: PENDING, VERIFIED, REJECTED.',
    'any.required': 'Status verifikasi wajib diisi.',
  }),
  verificationNotes: joi.string().allow('').optional().messages({
    'string.base': 'Catatan verifikasi harus berupa teks.',
  }),
})

const getAllReportByProgressModel = joi.object({
  page: joi.number().integer().min(1).default(1).messages({
    'number.base': 'Halaman harus berupa angka.',
    'number.integer': 'Halaman harus berupa bilangan bulat.',
    'number.min': 'Halaman minimal adalah {#limit}.',
  }),
  limit: joi.number().integer().min(1).max(100).default(10).messages({
    'number.base': 'Batas harus berupa angka.',
    'number.integer': 'Batas harus berupa bilangan bulat.',
    'number.min': 'Batas minimal adalah {#limit}.',
    'number.max': 'Batas maksimal adalah {#limit}.',
  }),
  status: joi.string().valid('PENDING', 'VERIFIED', 'REJECTED').optional().messages({
    'string.base': 'Status harus berupa teks.',
    'any.only': 'Status harus salah satu dari: PENDING, VERIFIED, REJECTED.',
  }),
  stage: joi.string().valid(...progressStageEnum).optional().messages({
    'string.base': 'Stage harus berupa teks.',
    'any.only': `Stage harus salah satu dari: ${progressStageEnum.join(', ')}`,
  })
})

const createReportProgressSchema = joi.object({
  progressNotes: joi.string().min(10).required().messages({
    'string.base': 'Progress Notes harus berupa teks',
    'string.min': 'Progress Notes minimal harus 10 karakter',
    'any.required': 'Progress Notes wajib diisi',
  }),

  stage: joi.string().valid(...progressStageEnum).optional().default('REVIEW').messages({
    'string.base': 'Stage harus berupa teks',
    'any.only': `Stage harus salah satu dari: ${progressStageEnum.join(', ')}`,
  }),

});

export { reportModel, createReportProgressSchema, verifyReportModel, getAllReportByProgressModel };
