import joi from 'joi';
const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/
const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{7,11}$/;

const registerModel = joi.object().keys({
  username: joi.string().alphanum().min(3).max(30).required().messages({
    'string.base': 'Username harus berupa teks.',
    'string.empty': 'Username tidak boleh kosong.',
    'string.alphanum': 'Username hanya boleh berisi huruf dan angka.',
    'string.min': 'Username minimal harus {#limit} karakter.',
    'string.max': 'Username maksimal harus {#limit} karakter.',
    'any.required': 'Username wajib diisi.',
  }),

  firstName: joi.string().max(50).required().messages({
    'string.base': 'Nama depan harus berupa teks.',
    'string.empty': 'Nama depan tidak boleh kosong.',
    'string.max': 'Nama depan maksimal harus {#limit} karakter.',
    'any.required': 'Nama depan wajib diisi.',
  }),

  lastName: joi.string().max(50).allow('').messages({
    'string.base': 'Nama belakang harus berupa teks.',
    'string.max': 'Nama belakang maksimal harus {#limit} karakter.',
  }),

  email: joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.base': 'Email harus berupa teks.',
    'string.empty': 'Email tidak boleh kosong.',
    'string.email': 'Format email tidak valid.',
    'any.required': 'Email wajib diisi.',
  }),

  password: joi.string().min(8).pattern(regex).required().messages({
    'string.base': 'Password harus berupa teks.',
    'string.empty': 'Password tidak boleh kosong.',
    'string.min': 'Password minimal harus {#limit} karakter.',
    'string.pattern.base': 'Password harus mengandung setidaknya satu huruf besar, satu huruf kecil, dan satu angka.',
    'any.required': 'Password wajib diisi.',
  }),

  street: joi.string().required().messages({
    'string.base': 'Alamat harus berupa teks.',
    'string.empty': 'Alamat tidak boleh kosong.',
    'any.required': 'Alamat wajib diisi.',
  }),

  phoneNumber: joi.string().pattern(phoneRegex).optional().allow(null, '').messages({
    'string.base': 'Nomor telepon harus berupa teks.',
    'string.pattern.base': 'Format nomor telepon yang Anda masukkan tidak valid.',
  }),
  provinceId: joi.number().integer().positive().required().messages({
    'number.base': 'Provinsi wajib dipilih.',
    'number.integer': 'Provinsi wajib dipilih.',
    'number.positive': 'Provinsi wajib dipilih.',
    'any.required': 'Provinsi wajib dipilih.',
  }),
  regencyId: joi.number().integer().positive().required().messages({
    'number.base': 'Kabupaten/Kota wajib dipilih.',
    'number.integer': 'Kabupaten/Kota wajib dipilih.',
    'number.positive': 'Kabupaten/Kota wajib dipilih.',
    'any.required': 'Kabupaten/Kota wajib dipilih.',
  }),
});

const loginModel = joi.object().keys({
  identifier: joi.string().required().messages({
    'string.empty': 'Harap isi Username atau Email',
    'any.required': 'Username atau Email wajib diisi.',
  }),
  password: joi.string().required().messages({
    'string.empty': 'Harap isi Password',
    'any.required': 'Password wajib diisi.',
  })
});

export { registerModel, loginModel }
