const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const {
  handle400, handle404, handle405, handle422, handle500,
} = require('./errors/index');


app.use(bodyParser.json());


app.use('/api', apiRouter);
app.use('/*', (req, res) => {
  res.status(404).send({ message: `Error Code: ${res.statusCode} : Page Not Found` });
});
app.use(handle422);
app.use(handle400);
app.use(handle404);
app.use(handle500);

module.exports = app;
