const mongoose = require('mongoose');
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res.status(500).send({ message: 'server error' });
    });
};

const getUserById = (req, res) => {
  const { id } = req.params;
  if (mongoose.Types.ObjectId.isValid(id)) {
    User.findById({ _id: id })
      .then((user) => {
        if (user) {
          res.send({ data: user });
        } else {
          res.status(404).send({ message: 'user not found' });
        }
      })
      .catch(() => {
        res.status(500).send({ message: 'server error' });
      });
  } else {
    res.status(400).send({ message: 'incorrect id' });
  }
};

const updateUserById = (req, res) => {
  const { name, about, avatar } = req.body;

  if ((name && about && avatar)) {
    if (mongoose.Types.ObjectId.isValid(req.user._id)) {
      User.findByIdAndUpdate(
        req.user._id,
        { name, about, avatar },
        { new: true, runValidators: true },
      )
        .then((user) => {
          if (user) {
            res.send({ data: user });
          } else {
            res.status(404).send({ message: 'user not found' });
          }
        })
        .catch(() => {
          res.status(500).send({ message: 'server error' });
        });
    } else {
      res.status(400).send({ message: 'incorrect id' });
    }
  } else {
    res.status(400).send({ message: 'incorrect data' });
  }
};

const updateUserAvatarById = (req, res) => {
  const { avatar } = req.body;

  if (avatar) {
    if (mongoose.Types.ObjectId.isValid(req.user._id)) {
      User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
        .then((user) => {
          if (user) {
            res.send({ data: user });
          } else {
            res.status(404).send({ message: 'user not found' });
          }
        })
        .catch(() => {
          res.status(500).send({ message: 'server error' });
        });
    } else {
      res.status(400).send({ message: 'incorrect id' });
    }
  } else {
    res.status(400).send({ message: 'incorrect data' });
  }
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  if ((name && about && avatar)) {
    User.create({ name, about, avatar })
      .then((user) => res.send({ data: user }))
      .catch(() => {
        res.status(500).send({ message: 'server error' });
      });
  } else {
    res.status(400).send({ message: 'incorrect data' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  updateUserAvatarById,
};
