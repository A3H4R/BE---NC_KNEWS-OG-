const {
  fetchArticles, fetchArticlesById, changeVote,
} = require('../db/models/articles');


exports.getArticles = (req, res, next) => {
  const {
    limit, sort_by, order, p,
  } = req.query;

  fetchArticles(limit, sort_by, order, p)
    .then(articles => res.status(200).send({ articles }))
    .catch(next);
};


exports.getArticlesById = (req, res, next) => {
  const {
    limit, sort_by, order, p,
  } = req.query;
  const { article_id } = req.params;
  fetchArticlesById(article_id, limit, sort_by, order, p)
    .then(article => res.status(200).send({ article }))
    .catch(next);
};

exports.updateVote = (req, res, next) => {
  const { inc_vote = 0 } = req.body;
  const { article_id } = req.params;
  console.log(article_id);
  changeVote(article_id, inc_vote)
    .then(([article]) => res.status(200).send({ article }))
    .catch(next);
};
