import joi from 'joi';
const regex = /^(?=.*[a-z])(?=.*[A-Z])/

const registerModel = joi.object().keys({
  username: joi.string().required().messages({
    'string.empty': 'Harap isi Username'
  }),
  firstName: joi.string().required().messages({
    'string.empty': 'Harap isi Nama Lengkap'
  }),
  lastName: joi.string().required().messages({
    'string.empty': 'Harap isi Nama Lengkap'
  }),
  email: joi.string().email().required().messages({
    'string.empty': 'Harap isi Email',
  }),
  password: joi.string().min(6).regex(regex).required().messages({
    'string.empty': 'Harap isi Password',
    'string.min': 'Harap isi password minimal 6 karakter ',
    'string.pattern.base': 'Harap Minimal satu huruf besar'
  })
});

const loginModel = joi.object().keys({
  username: joi.string().messages({
    'string.empty': 'Harap isi Username'
  }),
  email: joi.string().email().messages({
    'string.empty': 'Harap isi Email',

  }),
  password: joi.string().min(6).regex(regex).required().messages({
    'string.empty': 'Harap isi Password',
    'string.min': 'Harap isi password minimal 6 karakter ',
    'string.pattern.base': 'Harap Minimal satu huruf besar'
  })
});

const updateUsernameModel = joi.string().required().messages({
  'string.empty': 'Harap isi nama Lengkap Baru Kamu'
})

export { registerModel, loginModel, updateUsernameModel }
