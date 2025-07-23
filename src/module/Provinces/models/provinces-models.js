import joi from 'joi';

export const reportSchema = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  photoUrl: joi.string().uri().required(),
  latitude: joi.number().required(),
  longitude: joi.number().required(),
  address: joi.string().required(),
  verificationStatus: joi.string().valid('pending', 'verified', 'rejected').default('pending'),
  verificationNotes: joi.string().allow(null, ''),
  author_id: joi.number().integer().required(),
  verifier_id: joi.number().integer().allow(null),
});

