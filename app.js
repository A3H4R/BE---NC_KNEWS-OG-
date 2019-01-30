const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const { handle400, handle404 } = require('./errors/index');
// const topicsRouter = require('./routes/topics');
// const usersRouter = require('./routes/users');
// const articlesRouter = require('./routes/articles');


app.use(bodyParser.json());
app.use('/api', apiRouter);


app.use(handle400);
app.use(handle404);

app.use((err, req, res, next) => {
  console.log(err);
  next({ status: 500, message: 'internal server error' });
});


module.exports = app;
