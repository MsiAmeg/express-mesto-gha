const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserById,
  updateUserById,
  updateUserAvatarById,
  getUserMe,
} = require('../controllers/user');

router.get('/', getUsers);

router.get('/me', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUserMe);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().pattern(/^https?:\/\/(www.)?[\da-z(\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\,\;\=)]{2,}#?$/),
  }),
}), updateUserById);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().required().pattern(/^https?:\/\/(www.)?[\da-z(\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\,\;\=)]{2,}#?$/),
  }),
}), updateUserAvatarById);

module.exports = router;
