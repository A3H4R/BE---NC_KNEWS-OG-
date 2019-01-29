const express = require('express');

const app = express();
const apiRouter = require('./routes/api');
const topicsRouter = require('./routes/topics');
const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');


app.use('/api', apiRouter);
app.use('/topics', topicsRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);


app.use((err, req, res, next) => {
  res.status(500).send({ err });
});

module.exports = app;
