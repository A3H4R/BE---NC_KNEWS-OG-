const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');

// const topicsRouter = require('./routes/topics');
// const usersRouter = require('./routes/users');
// const articlesRouter = require('./routes/articles');


app.use(bodyParser.json());
app.use('/api', apiRouter);
// app.use('/users', usersRouter);
// app.use('/articles', articlesRouter);


app.use((err, req, res, next) => {
  console.log(err);
  next({ status: 500, message: 'internal server error' });
});

module.exports = app;
