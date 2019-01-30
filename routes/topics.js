const topicsRouter = require('express').Router();


const { getTopics, createTopic, getArticlesByTopic } = require('../controllers/topics');

topicsRouter.get('/', getTopics);
topicsRouter.post('/', createTopic);

topicsRouter.get('/:topic/articles', getArticlesByTopic);

module.exports = topicsRouter;
