const topicsRouter = require('express').Router();
const { handle405 } = require('../errors/index');


const {
  getTopics, createTopic, getArticlesByTopic, createArticleByTopic,
} = require('../controllers/topics');

topicsRouter.route('/')
  .get(getTopics)
  .post(createTopic)
  .all(handle405);

topicsRouter.route('/:topic/articles')
  .get(getArticlesByTopic)
  .post(createArticleByTopic)
  .all(handle405);

module.exports = topicsRouter;
