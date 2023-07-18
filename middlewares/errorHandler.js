const errorMessageGeneralError = 'На сервере произошла ошибка';

const errorHandler = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: errorMessageGeneralError });
  }
  next();
};

module.exports = errorHandler;
