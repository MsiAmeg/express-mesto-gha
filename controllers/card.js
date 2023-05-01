const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      res.status(500).send({ message: 'server error' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((cards) => res.status(201).send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'incorrect data' });
      }

      return res.status(500).send({ message: 'server error' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete({ _id: cardId })
    .then((cards) => {
      if (cards) {
        res.send({ data: cards });
      } else {
        res.status(404).send({ message: 'card not found' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'incorrect id' });
      }

      return res.status(500).send({ message: 'server error' });
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('DataNotFound'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'DataNotFound') {
        return res.status(404).send({ message: 'card not found' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'incorrect id' });
      }
      return res.status(500).send({ message: 'server error' });
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('DataNotFound'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'DataNotFound') {
        return res.status(404).send({ message: 'card not found' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'incorrect id' });
      }

      return res.status(500).send({ message: 'server error' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
