const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { createUser, login } = require('./controllers/user');

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
    avatar: Joi.string().pattern(/^https?:\/\/(www.)?[\da-z(\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\,\;\=)]{2,}#?$/),
  }),
}), createUser);

app.use(require('./middlewares/auth'));

app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));

app.use('*', ((req, res) => {
  res.status(404).send({ message: 'invalid url' });
}));

app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { code, message, name } = err;

  if (code === 11000) {
    return res.status(409).send({ message: 'this email already used' });
  }
  if (message === 'DataNotFound') {
    return res.status(404).send({ message: 'data not found' });
  }
  if (name === 'ValidationError') {
    return res.status(400).send({ message: 'incorrect data' });
  }
  if (name === 'CastError') {
    return res.status(400).send({ message: 'incorrect id' });
  }

  return res.status(500).send({ message: 'server error' });
});

app.listen(3000);
