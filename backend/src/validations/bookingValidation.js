const Joi = require('joi');

const bookingSchema = Joi.object({
  walkerId: Joi.string().required(),
  dogId: Joi.string().required(),
  date: Joi.date().required(),
});

module.exports = { bookingSchema };