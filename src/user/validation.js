const Joi = require('joi');

const addUser = Joi.object({
  first_name: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  last_name: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  email: Joi.string()
    .email({minDomainSegments: 2})
    .required(),
  quiz_responses: Joi.object()
    .required()
})

const updateUser = Joi.object({
  first_name: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  last_name: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  quiz_responses: Joi.object()
    .required()
})

const videoStats = Joi.object({
  user_id: Joi.string()
    .alphanum()
    .required(),
  video_id: Joi.string()
    .alphanum()
    .required(),
  duration: Joi.object()
    .required(),
  sensor_data: Joi.object()
})

module.exports = {
  addUser,
  updateUser,
  videoStats
};
