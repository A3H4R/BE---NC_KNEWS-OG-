const articlesRouter = require('express').Router();


const {
  getTopics,
} = require('../controllers/articles');

articlesRouter.get('/', getTopics);


module.exports = articlesRouter;
