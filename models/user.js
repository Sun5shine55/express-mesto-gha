const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const validator = require('validator');

const regex = /(https?:\/\/)(www)?([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=])*#?$/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [2, 'Минимальная длина поля "name" - 2'],
    maxLength: [30, 'Максимальная длина поля "name" - 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minLength: [2, 'Минимальная длина поля "about" - 2'],
    maxLength: [30, 'Максимальная длина поля "about" - 30'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        return regex.test(v);
      },
      message: 'Некорректный URL',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный e-mail',
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function signIn(email, password) {
  return this.findOne({ email }, { runValidators: true })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
