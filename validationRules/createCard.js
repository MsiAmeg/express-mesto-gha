const { Joi } = require('celebrate');

const createCardRules = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(new RegExp(process.env.URL_PATTERN)),
  }),
};

module.exports = createCardRules;
