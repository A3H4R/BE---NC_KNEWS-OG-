const connection = require('../db/connection');
const { fetchTopics, addTopic, fetchArticlesByTopic } = require('../db/models/topics');

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then(topics => res.status(200).send({ topics }))
    .catch(next);
};

exports.createTopic = (req, res, next) => {
  addTopic(req.body)
    .then(newTopic => res.status(201).send({ newTopic }))
    .catch(next);
};

exports.getArticlesByTopic = (req, res, next) => {
  const {
    limit,
    sort_by,
    p,
    order,
  } = req.query;
  const topic = req.params.topic;
  fetchArticlesByTopic(topic, limit, sort_by, p, order)
    .then((articles) => {
      if (articles.length === 0) {
        next({ status: 404, message: 'topic does not exist' });
      } else {
        res.status(200).send({ articles });
      }
    })
    .catch(next);
};
