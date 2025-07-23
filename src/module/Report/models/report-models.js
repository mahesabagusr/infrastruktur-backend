import joi from 'joi';

const reportModel = joi.object({
  title: joi.string().min(3).max(100).required(),
  description: joi.string().min(10).required(),
  latitude: joi.number().min(-90).max(90).required(),
  longitude: joi.number().min(-180).max(180).required(),
  address: joi.string().min(10).required(),
  email: joi.string().email().required().messages({
    'string.empty': 'Harap isi Email',
  }),
});

export { reportModel }
