const Joi = require('joi');

const addingVideo = Joi.object({
  url: Joi.string()
    .uri()
    .required(),
  title: Joi.string()
    .min(3)
    .max(30)
    .required(),
  sub_title: Joi.string()
    .min(3)
    .max(30)
    .required(),
  category: Joi.string()
    .alphanum()
    .required(),
  instructor: Joi.string()
    .alphanum()
    .required()
})
module.exports = {
  addingVideo
};
