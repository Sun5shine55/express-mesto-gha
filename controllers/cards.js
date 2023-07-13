const { ObjectId } = require('mongodb');
const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const ValidationError = require('../errors/ValidationError');
const InternalServerError = require('../errors/ValidationError');

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send(cards))
  .catch((err) => {
    throw new InternalServerError({ message: err.message });
  });

const deleteCard = (req, res) => {
  const _id = req.params.cardId;
  if (ObjectId.isValid(_id)) {
    return Card.findById(_id).then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Нет прав на удаление этой карточки');
      }
      return Card.deleteOne(card).then(() => res.status(200).send({ message: 'Карточка удалена' }));
    })
      .catch((err) => {
        throw new InternalServerError({ message: err.message });
      });
  } return () => {
    throw new ValidationError('Передан некорректный _id карточки');
  };
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((newCard) => res.status(201).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при создании карточки');
      }
      return () => {
        throw new InternalServerError({ message: err.message });
      };
    });
};

const putLike = (req, res) => {
  if (ObjectId.isValid(req.params.cardId)) {
    return Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      return res.status(200).send(card);
    })
      .catch((err) => {
        throw new InternalServerError({ message: err.message });
      });
  } return () => {
    throw new ValidationError('Передан некорректный _id карточки');
  };
};

const deleteLike = (req, res) => {
  if (ObjectId.isValid(req.params.cardId)) {
    return Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      return res.status(200).send(card);
    })
      .catch((err) => {
        throw new InternalServerError({ message: err.message });
      });
  } return () => {
    throw new ValidationError('Передан некорректный _id карточки');
  };
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  putLike,
  deleteLike,
};
