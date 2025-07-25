import joi from 'joi';

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

const progressModel = joi

export { reportModel }
