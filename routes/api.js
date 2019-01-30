const apiRouter = require('express').Router();
const topicsRouter = require('./topics');


// const { controller funcs } = require('../controllers/shops');

apiRouter.use('/topics', topicsRouter);


module.exports = apiRouter;
