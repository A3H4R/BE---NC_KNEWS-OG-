const topicsRouter = require('express').Router();


const {
  getTopics, createTopic, getArticlesByTopic, createArticleByTopic,
} = require('../controllers/topics');

topicsRouter.get('/', getTopics);
topicsRouter.post('/', createTopic);

topicsRouter.get('/:topic/articles', getArticlesByTopic);
topicsRouter.post('/:topic/articles', createArticleByTopic);

module.exports = topicsRouter;
