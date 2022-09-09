const Joi = require('joi');

const videoDetail = Joi.object({
  id: Joi.string()
    .alphanum()
    .required()
})

const videoCategory = Joi.object({
  category: Joi.string()
    .alphanum()
    .required()
})

module.exports = {
  videoDetail,
  videoCategory
};
