const { ObjectId } = require('mongodb');
const User = require('../models/user');
const { VALIDATION_CODE, NOTFOUNDERROR_CODE } = require('../errors/errors');

const getUsers = (req, res) => User.find({})
  .then((users) => {
    if (!users) {
      return res
        .status(NOTFOUNDERROR_CODE)
        .send({ message: 'Зарегистрированных пользователей нет' });
    }
    return res.status(200).send(users);
  })
  .catch((err) => res.status(err.status).send({ message: err.message }));

const getUserById = (req, res) => {
  if (ObjectId.isValid(req.params.userId)) {
    return User.findOne({ _id: new ObjectId(req.params.userId) }).then((user) => {
      if (!user) {
        return res
          .status(NOTFOUNDERROR_CODE)
          .send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(200).send(user);
    })
      .catch((err) => res.status(err.status).send({ message: err.message }));
  } return res
    .status(VALIDATION_CODE)
    .send({ message: 'Передан некорректный _id пользователя.' });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((newUser) => res.status(201).send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_CODE).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      }
      return res.status(err.status).send({ message: err.message });
    });
};

const updateUserData = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(NOTFOUNDERROR_CODE)
          .send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_CODE).send({
          message: err.message,
        });
      }
      return res.status(err.status).send({ message: err.message });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(NOTFOUNDERROR_CODE)
          .send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_CODE).send({
          message: err.message,
        });
      }
      return res.status(err.status).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserData,
  updateUserAvatar,
  VALIDATION_CODE,
  NOTFOUNDERROR_CODE,
};
