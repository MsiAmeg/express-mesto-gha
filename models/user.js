const mongoose = require('mongoose');
const validator = require('validator');

const userSChema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: [true, 'Данный email уже используется'],
    validate: {
      validator: validator.isEmail,
      message: 'incorrect email',
    },
    minlength: [2, 'Минимальная длина поля "email" - 2'],
    maxlength: [30, 'Максимальная длина поля "email" - 30'],
  },
  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
    select: false,
    minlength: [2, 'Минимальная длина поля "password" - 2'],
    maxlength: [60, 'Максимальная длина поля "password" - 30'],
  },
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator(url) {
        // eslint-disable-next-line no-useless-escape
        return /^https?:\/\/(www.)?[\da-z(\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\,\;\=)]{2,}#?$/.test(url);
      },
      message: 'incorrect URL',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSChema);
