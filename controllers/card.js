const mongoose = require('mongoose');
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
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'incorrect data' });
      }

      return res.status(500).send({ message: 'server error' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  if (mongoose.Types.ObjectId.isValid(cardId)) {
    Card.findByIdAndDelete({ _id: cardId })
      .then((cards) => {
        if (cards) {
          res.send({ data: cards });
        } else {
          res.status(404).send({ message: 'card not found' });
        }
      })
      .catch(() => {
        res.status(500).send({ message: 'server error' });
      });
  } else {
    res.status(400).send({ message: 'incorrect id' });
  }
};

const likeCard = (req, res) => {
  const { cardId } = req.params;

  if (mongoose.Types.ObjectId.isValid(cardId)) {
    Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true },
    )
      .then((card) => {
        if (card) {
          res.send({ data: card });
        } else {
          res.status(404).send({ message: 'card not found' });
        }
      })
      .catch(() => {
        res.status(500).send({ message: 'server error' });
      });
  } else {
    res.status(400).send({ message: 'incorrect id' });
  }
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;

  if (mongoose.Types.ObjectId.isValid(cardId)) {
    Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true, runValidators: true },
    )
      .then((card) => {
        if (card) {
          res.send({ data: card });
        } else {
          res.status(404).send({ message: 'card not found' });
        }
      })
      .catch(() => {
        res.status(500).send({ message: 'server error' });
      });
  } else {
    res.status(400).send({ message: 'incorrect id' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
