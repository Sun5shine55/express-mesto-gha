const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const InternalServerError = require('../errors/ValidationError');

const getUsers = (req, res) => User.find({})
  .then((users) => {
    if (!users) {
      return () => {
        throw new NotFoundError('Зарегистрированных пользователей нет');
      };
    }
    return res.status(200).send(users);
  })
  .catch((err) => {
    throw new InternalServerError({ message: err.message });
  });

const getUserById = (req, res) => {
  if (ObjectId.isValid(req.params.userId)) {
    return User.findOne({ _id: new ObjectId(req.params.userId) }).then((user) => {
      if (!user) {
        return () => {
          throw new NotFoundError('Пользователь по указанному _id не найден');
        };
      }
      return res.status(200).send(user);
    })
      .catch((err) => {
        throw new InternalServerError({ message: err.message });
      });
  } return () => {
    throw new ValidationError('Передан некорректный _id пользователя');
  };
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    throw new ValidationError('Не переданы email или пароль');
  }
  bcrypt.hash(password, 8)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((newUser) => res.status(201).send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError(err.message);
      }
      return () => {
        throw new InternalServerError({ message: err.message });
      };
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
        return () => {
          throw new NotFoundError('Пользователь по указанному _id не найден');
        };
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError({
          message: err.message,
        });
      }
      return () => {
        throw new InternalServerError({ message: err.message });
      };
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
        return () => {
          throw new NotFoundError('Пользователь по указанному _id не найден');
        };
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError({
          message: err.message,
        });
      }
      return () => {
        throw new InternalServerError({ message: err.message });
      };
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.status(200).send({ token: jwt.sign({ _id: user._id }, 'here-there-is-my-key', { expiresIn: '7d' }) });
    })
    .catch(() => {
      throw new UnauthorizedError('Ошибка авторизации');
    });
};

const getMyData = (req, res) => {
  const { _id } = req.user._id;
  User.find({ _id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      throw new InternalServerError({ message: err.message });
    });
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
