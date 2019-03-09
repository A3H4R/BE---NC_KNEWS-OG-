const apiRouter = require('express').Router();
const topicsRouter = require('./topics');
const articlesRouter = require('./articles');
const usersRouter = require('./users');
const allEndpointsObj = require('../db/models/endpoints');
const { handle405 } = require('../errors/index');

const getEndpoints = (req, res, next) => {
  res.status(200).send(allEndpointsObj);
};

apiRouter
  .route('/')
  .get(getEndpoints)
  .all(handle405);

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
