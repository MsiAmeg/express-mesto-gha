const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const SECRET_KEY = '8924c2c6c6792d5e3355ee3f6a6b5a817b9d00b8';

const getUsers = (req, res, next) => {
  User.find({})
    .orFail(new NotFoundError('user not found'))
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUserMe = (req, res, next) => {
  const { _id } = req.user;

  User.findById({ _id })
    .then((user) => {
      if (user) {
        const userParsed = {
          _id: user._id,
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        };
        res.send({ data: userParsed });
      } else {
        throw new NotFoundError('user not found');
      }
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { id } = req.params;

  User.findById({ _id: id })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundError('user not found');
      }
    })
    .catch(next);
};

const updateUserById = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about, avatar },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('user not found'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const updateUserAvatarById = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFoundError('user not found'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => {
      const userParsed = {
        email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      };
      res.status(201).send({ data: userParsed });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('login or password incorrect');
      }
      return bcrypt.compare(password, user.password)
        .then((isValid) => {
          if (!isValid) {
            throw new UnauthorizedError('login or password incorrect');
          }
          const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });

          return res.status(200).cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).send({ _id: user._id });
        });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  updateUserAvatarById,
  login,
  getUserMe,
  SECRET_KEY,
};
