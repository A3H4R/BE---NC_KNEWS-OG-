
const {
  fetchTopics, addTopic, fetchArticlesByTopic, addArticle, totalArticlesCount,
} = require('../db/models/topics');

// const { topic } = req.params.topic;
// exports.getTotalArticles = (req, res, next) => {
// totalArticlesCount(topic)
//     .then(total => res.send({ total }))
//     .catch(next);
// };

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
    order,
    p,
  } = req.query;
  const topic = req.params.topic;
  fetchArticlesByTopic(topic, limit, sort_by, order, p)
    .then((articles) => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, message: 'topic does not exist' });
      }
      res.status(200).send({ articles });
    })
    .catch(err => next(err));
};

exports.createArticleByTopic = (req, res, next) => {
  const { topic } = req.params;
  const { title, body, username } = req.body;

  addArticle({
    title, body, username, topic,
  })
    .then(newArticle => res.status(201).send({ newArticle }))
    .catch(next);
};
