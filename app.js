const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { NOTFOUNDERROR_CODE } = require('./errors/errors');

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(bodyParser.json());

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => {
});

app.use((req, res, next) => {
  req.user = {
    _id: '649ee54a02c9d3cc3622c224',
  };

  next();
});

app.use(userRoutes);
app.use(cardRoutes);

app.all('*', (req, res) => {
  res.status(NOTFOUNDERROR_CODE).send({ message: 'указан неправильный путь' });
});

app.listen(PORT, () => {
});
