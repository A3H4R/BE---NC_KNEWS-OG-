const topicsRouter = require('express').Router();


const {
  getTopics, createTopic, getArticlesByTopic, createArticleByTopic,
} = require('../controllers/topics');

topicsRouter.route('/')
  .get(getTopics)
  .post(createTopic);

topicsRouter.route('/:topic/articles')
  .get(getArticlesByTopic)
  .post(createArticleByTopic);

module.exports = topicsRouter;
