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
  address: joi.string().min(10).required().messages({
    'string.base': 'Alamat harus berupa teks.',
    'string.empty': 'Alamat tidak boleh kosong.',
    'string.min': 'Alamat minimal harus memiliki {#limit} karakter.',
    'any.required': 'Alamat wajib diisi.',
  }),
  email: joi.string().email().messages({
    'string.empty': 'Harap isi Email',
  }),
});

const createReportProgressSchema = joi.object({
  report_id: joi.number().integer().positive().required().messages({
    'number.base': 'Report ID harus berupa angka',
    'number.integer': 'Report ID harus berupa bilangan bulat',
    'number.positive': 'Report ID harus bernilai positif',
    'any.required': 'Report ID wajib diisi',
  }),

  photoUrl: joi.string().uri().required().messages({
    'string.base': 'Photo URL harus berupa teks',
    'string.uri': 'Photo URL harus berupa URL yang valid',
    'any.required': 'Photo URL wajib diisi',
  }),

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

export { reportModel, createReportProgressSchema }
