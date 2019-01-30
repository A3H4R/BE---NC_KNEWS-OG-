const topicsRouter = require('express').Router();


const { getTopics, createTopic } = require('../controllers/topics');

topicsRouter.get('/', getTopics);
topicsRouter.post('/', createTopic);

module.exports = topicsRouter;
