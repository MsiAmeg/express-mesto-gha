const { Joi } = require('celebrate');

const userMeAvatarRules = {
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(new RegExp(process.env.URL_PATTERN)),
  }),
};

module.exports = userMeAvatarRules;
