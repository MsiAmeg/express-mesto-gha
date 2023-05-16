const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserById,
  updateUserById,
  updateUserAvatarById,
  getUserMe,
} = require('../controllers/user');
const regexUrl = require('../app');

router.get('/', getUsers);

router.get('/me', getUserMe);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().required().length(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().required().regex(new RegExp(regexUrl)),
  }),
}), updateUserById);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().required().regex(new RegExp(regexUrl)),
  }),
}), updateUserAvatarById);

module.exports = router;
