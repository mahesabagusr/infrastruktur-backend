import Joi from "joi";

const articleCreateModel = Joi.object({
  title: Joi.string().min(3).max(255).required()
    .messages({
      'string.min': 'Judul harus memiliki minimal 3 karakter',
      'string.max': 'Judul tidak boleh lebih dari 255 karakter',
      'any.required': 'Judul artikel diperlukan'
    }),
  content: Joi.string().min(10).required()
    .messages({
      'string.min': 'Konten harus memiliki minimal 10 karakter',
      'any.required': 'Konten artikel diperlukan'
    }),
  categoryId: Joi.number().integer().positive().optional()
    .messages({
      'number.positive': 'Category ID harus berupa angka positif'
    }),
  authorId: Joi.number().integer().positive().required()
    .messages({
      'number.positive': 'Author ID harus berupa angka positif',
      'any.required': 'Author ID diperlukan'
    }),
  published: Joi.boolean().optional().default(false),
  tags: Joi.array().items(Joi.string()).optional()
});

const articleUpdateModel = Joi.object({
  title: Joi.string().min(3).max(255).optional()
    .messages({
      'string.min': 'Judul harus memiliki minimal 3 karakter',
      'string.max': 'Judul tidak boleh lebih dari 255 karakter'
    }),
  content: Joi.string().min(10).optional()
    .messages({
      'string.min': 'Konten harus memiliki minimal 10 karakter'
    }),
  categoryId: Joi.number().integer().positive().optional()
    .messages({
      'number.positive': 'Category ID harus berupa angka positif'
    }),
  published: Joi.boolean().optional(),
  tags: Joi.array().items(Joi.string()).optional()
});

const articleQueryModel = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  search: Joi.string().optional(),
  categoryId: Joi.number().integer().positive().optional(),
  published: Joi.boolean().optional(),
  authorId: Joi.number().integer().positive().optional()
});

const articleParamsModel = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      'number.positive': 'ID artikel harus berupa angka positif',
      'any.required': 'ID artikel diperlukan'
    })
});

export { 
  articleCreateModel, 
  articleUpdateModel, 
  articleQueryModel, 
  articleParamsModel,
};
