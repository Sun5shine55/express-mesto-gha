const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

const getMyData = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => res.status(404).send({ message: 'Пользователь по указанному _id не найден' }))
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    throw new ValidationError('Не переданы email или пароль');
  } return User.findOne({ email })
    .then((oldUser) => {
      if (oldUser) { throw new ConflictError('Пользователь с таким email уже зарегистрирован'); }
      return bcrypt.hash(password, 8)
        .then((hash) => User.create({
          name,
          about,
          avatar,
          email,
          password: hash,
        }))
        .then((user) => res.status(201).send({
          _id: user._id,
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        }))
        .catch(next);
    })
    .catch(next);
};

const updateUserData = (req, res, next) => {
  const newUser = req.body;
  User.findByIdAndUpdate(req.user._id, newUser, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => res.send(user))
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return () => {
          throw new NotFoundError('Пользователь по указанному _id не найден');
        };
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) { throw new UnauthorizedError('Пользователь с таким email не зарегистрирован'); }
      return User.findUserByCredentials(email, password)
        .then((inputUser) => {
          res.status(200).send({ token: jwt.sign({ _id: inputUser._id }, 'here-there-is-my-key', { expiresIn: '7d' }) });
        })
        .catch(() => { throw new UnauthorizedError('Ошибка авторизации'); });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserData,
  updateUserAvatar,
  login,
  getMyData,
};
