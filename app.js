const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '644bf7c393fc2bc0d5b43fb8',
  };

  next();
});
app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));

app.use('*', ((req, res) => {
  res.status(404).send({ message: 'invalid url' });
}));

app.listen(3000);
