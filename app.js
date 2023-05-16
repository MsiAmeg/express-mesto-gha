const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { createUser, login } = require('./controllers/user');
const NotFoundError = require('./errors/NotFoundError');
// eslint-disable-next-line no-useless-escape
const regexUrl = /^https?:\/\/(www.)?[\da-z(\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\,\;\=)]{2,}#?$/;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(30),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(30),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().regex(new RegExp(regexUrl)),
  }),
}), createUser);

app.use(require('./middlewares/auth'));

app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));

app.use('*', (() => {
  throw new NotFoundError('invalid url');
}));

app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  if (statusCode === 11000) {
    return res.status(409).send({ message: 'this email already used' });
  }

  return res.status(statusCode).send({ message: statusCode === 500 ? 'server error' : message });
});

app.listen(3000);

module.exports = regexUrl;
