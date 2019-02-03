const apiRouter = require('express').Router();
const topicsRouter = require('./topics');
const articlesRouter = require('./articles');
const usersRouter = require('./users');

// const { controller funcs } = require('../controllers/shops');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);


module.exports = apiRouter;
