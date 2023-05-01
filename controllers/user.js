const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .orFail(new Error('DataNotFound'))
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.message === 'DataNotFound') {
        return res.status(404).send({ message: 'user not found' });
      }
      return res.status(500).send({ message: 'server error' });
    });
};

const getUserById = (req, res) => {
  const { id } = req.params;

  User.findById({ _id: id })
    .orFail(new Error('DataNotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'DataNotFound') {
        return res.status(404).send({ message: 'user not found' });
      }
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'incorrect id' });
      }
      return res.status(500).send({ message: 'server error' });
    });
};

const updateUserById = (req, res) => {
  const { name, about, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about, avatar },
    { new: true, runValidators: true },
  )
    .orFail(new Error('DataNotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'DataNotFound') {
        return res.status(404).send({ message: 'user not found' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'incorrect data' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'incorrect id' });
      }

      return res.status(500).send({ message: 'server error' });
    });
};

const updateUserAvatarById = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('DataNotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'DataNotFound') {
        return res.status(404).send({ message: 'user not found' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'incorrect data' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'incorrect id' });
      }

      return res.status(500).send({ message: 'server error' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'incorrect data' });
      }

      return res.status(500).send({ message: 'server error' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  updateUserAvatarById,
};
