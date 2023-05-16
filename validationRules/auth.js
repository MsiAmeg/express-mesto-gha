const { Joi } = require('celebrate');

const signInRules = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(30),
  }),
};

const signUpRules = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(30),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(new RegExp(process.env.URL_PATTERN)),
  }),
};

module.exports = {
  signInRules,
  signUpRules,
};
