const { ObjectId } = require('mongodb');
const Card = require('../models/card');
const { VALIDATION_CODE, NOTFOUNDERROR_CODE } = require('../errors/errors');

const getCards = (req, res) => Card.find({})
  .then((cards) => {
    if (!cards) { return res.status(NOTFOUNDERROR_CODE).send({ message: 'У пользователя нет карточек' }); }
    return res.status(200).send(cards);
  });

const deleteCard = (req, res) => {
  const _id = req.params.cardId;
  if (ObjectId.isValid(_id)) {
    return Card.findById(_id).then((card) => {
      if (!card) {
        return res
          .status(NOTFOUNDERROR_CODE)
          .send({ message: 'Передан несуществующий _id карточки.' });
      }
      return Card.deleteOne(card).then(() => res.status(200).send({ message: 'Карточка удалена' }));
    });
  } return res
    .status(VALIDATION_CODE)
    .send({ message: 'Передан некорректный _id карточки.' });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((newCard) => res.status(201).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_CODE).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      }
      return next(err);
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
        return res
          .status(NOTFOUNDERROR_CODE)
          .send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.status(200).send(card);
    });
  } return res
    .status(VALIDATION_CODE)
    .send({ message: 'Передан некорректный _id карточки.' });
};

const deleteLike = (req, res) => {
  if (ObjectId.isValid(req.params.cardId)) {
    return Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).then((card) => {
      if (!card) {
        return (
          res
            .status(NOTFOUNDERROR_CODE)
            // eslint-disable-next-line quotes
            .send({ message: 'Передан несуществующий _id карточки.' })
        );
      }
      return res.status(200).send(card);
    });
  } return res
    .status(VALIDATION_CODE)
    .send({ message: 'Передан некорректный _id карточки.' });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  putLike,
  deleteLike,
};
