const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/users");
const cardRoutes = require("./routes/cards");

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(bodyParser.json());

const { PORT = 3000 } = process.env;
mongoose.connect("mongodb://127.0.0.1:27017/mestodb").then(() => {
  console.log("connected to db");
});

app.use((req, res, next) => {
  req.user = {
    _id: "649ee54a02c9d3cc3622c224",
  };

  next();
});

app.use(userRoutes);
app.use(cardRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
