const apiRouter = require('express').Router();
const topicsRouter = require('./topics');
const articlesRouter = require('./articles');
const usersRouter = require('./users');
const allEndpointsObj = require('../db/models/endpoints');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);

const getEndpoints = (req, res, next) => {
  res.status(200).send(allEndpointsObj);
};

apiRouter.route('/').get(getEndpoints);

module.exports = apiRouter;
