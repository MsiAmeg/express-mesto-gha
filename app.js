require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, errors } = require('celebrate');
const { createUser, login } = require('./controllers/user');
const { signInRules, signUpRules } = require('./validationRules/auth');
const NotFoundError = require('./errors/NotFoundError');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.post('/signin', celebrate(signInRules), login);

app.post('/signup', celebrate(signUpRules), createUser);

app.use(require('./middlewares/auth'));

app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));

app.use('*', (() => {
  throw new NotFoundError('invalid url');
}));

app.use(errors());
app.use(require('./middlewares/error'));

app.listen(process.env.PORT);
