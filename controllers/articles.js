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
    .then(([article]) => {
      console.log(typeof inc_vote);
      if (typeof inc_vote !== 'number') {
        next({ status: 400, message: 'value for vote must must be a number' });
      } else if (!inc_vote) next({ status: 400, message: 'input for updating vote is missing' });
      else {
        res.status(200).send({ article });
      }
    })
    .catch(next);
};
