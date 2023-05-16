const { Joi } = require('celebrate');

const userMeRules = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().regex(new RegExp(process.env.URL_PATTERN)),
  }),
};

module.exports = userMeRules;
