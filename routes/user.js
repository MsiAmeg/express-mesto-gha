require('dotenv').config();
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
    avatar: Joi.string().regex(new RegExp(process.env.URL_PATTERN)),
  }),
}), updateUserById);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(new RegExp(process.env.URL_PATTERN)),
  }),
}), updateUserAvatarById);

module.exports = router;
