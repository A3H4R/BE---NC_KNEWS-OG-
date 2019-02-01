const {
  fetchArticles, fetchArticlesById,
} = require('../db/models/articles');


exports.getArticles = (req, res, next) => {
  const {
    limit, sort_by, order, p,
  } = req.query;

  const { article_id } = req.params;
  fetchArticles(article_id, limit, sort_by, order, p)
    .then(articles => res.status(200).send({ articles }))
    .catch(next);
};

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticlesById(article_id)
    .then(article => res.status(200).send({ article }))
    .catch(next);
};
