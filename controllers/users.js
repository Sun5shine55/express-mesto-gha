const User = require("../models/user");

const VALIDATION_CODE = 400;
const NOTFOUNDERROR_CODE = 404;

const getUsers = (req, res) => User.find({}).then((users) => res.send(users));

const getUserById = (req, res, next) => {
  console.log(req.params.userId);
  User.findById(req.params.userId)
    .then((user) => {
      if (ObjectId.isValid(_id)) {
        if (!user) {
          return res
            .status(404)
            .send({ message: "Пользователь по указанному _id не найден" });
        }
      } else {
        return res
          .status(400)
          .send({ message: "Передан некорректный _id карточки." });
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  console.log(req.body);
  return User.create({ name, about, avatar })
    .then((newUser) => res.status(201).send(newUser))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(VALIDATION_CODE).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      }
      return next(err);
    });
};

const updateUserData = (req, res, next) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
      return res.send(user);
    })
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(NOTFOUNDERROR_CODE)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
      return res.status(200).send(user);
    })
    .catch(next);
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
