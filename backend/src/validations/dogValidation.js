const Joi = require('joi');

const dogSchema = Joi.object({
  name: Joi.string().trim().min(1).max(50).required(),
  breed: Joi.string().trim().min(1).max(50).required(),
  size: Joi.string().valid('small', 'medium', 'large').required(),
});

module.exports = { dogSchema };