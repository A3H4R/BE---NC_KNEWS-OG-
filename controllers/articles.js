const {
  fetchArticles,
  fetchArticlesById,
  changeVote,
  removeArticle,
  fetchCommentsFromArticle,
  createComment,
  addVoteToComment,
  removeComment,
  totalArticles,
} = require('../db/models/articles');

exports.getArticles = (req, res, next) => {
  const {
    limit, sort_by, order, p,
  } = req.query;

  Promise.all([fetchArticles(limit, sort_by, order, p), totalArticles()])
    .then(([articles, total_count]) => {
      res.status(200).send({ articles, total_count });
    })
    .catch(err => next(err));
};

exports.getArticlesById = (req, res, next) => {
  const {
    limit, sort_by, order, p,
  } = req.query;
  const { article_id } = req.params;
  fetchArticlesById(article_id, limit, sort_by, order, p)
    .then(([article]) => {
      if (!article) {
        return Promise.reject({ status: 404, message: 'Article Not Found' });
      }
      return res.status(200).send({ article });
    })
    .catch(err => next(err));
};

exports.updateVote = (req, res, next) => {
  const { inc_vote = 0 } = req.body;
  const { article_id } = req.params;

  changeVote(article_id, inc_vote)
    .then(([article]) => {
      if (typeof inc_vote !== 'number') {
        return Promise.reject({
          status: 400,
          message: 'Value for vote must be a number',
        });
      }
      if (!inc_vote) {
        return Promise.reject({
          status: 400,
          message: 'Input for updating vote is missing',
        });
      }

      return res.status(200).send({ article });
    })
    .catch(err => next(err));
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  removeArticle(article_id)
    .then(deleteArticle => res.status(204).send({ deleteArticle }))
    .catch(next);
};

exports.getCommentsFromArticle = (req, res, next) => {
  const { limit, sort_by, p } = req.query;
  const { article_id } = req.params;

  let order;

  const commentsFromArticle = () => {
    fetchCommentsFromArticle(article_id, limit, sort_by, order, p)
      .then((comments) => {
        if (comments.length === 0) {
          return Promise.reject({
            status: 404,
            message: 'no comments found for this article',
          });
        }

        return res.status(200).send({ comments });
      })
      .catch(err => next(err));
  };
  if (req.query.sort_ascending === 'true') {
    order = 'asc';
    commentsFromArticle();
  } else {
    order = 'desc';
    commentsFromArticle();
  }
};

exports.addComment = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  createComment({ username, body, article_id })
    .then(([newComment]) => {
      if (body) res.status(201).send({ newComment });
    })
    .catch(next);
};

exports.updateCommentVote = (req, res, next) => {
  const { inc_vote = 0 } = req.body;
  const { article_id, comment_id } = req.params;

  addVoteToComment(article_id, comment_id, inc_vote)
    .then(([comment]) => {
      if (typeof inc_vote !== 'number') {
        return Promise.reject({
          status: 400,
          message: 'value for vote must be a number',
        });
      }
      if (!inc_vote) {
        return Promise.reject({
          status: 400,
          message: 'Input for updating vote is missing',
        });
      }

      return res.status(200).send({ comment });
    })
    .catch(err => next(err));
};

exports.deleteComment = (req, res, next) => {
  const { article_id, comment_id } = req.params;

  removeComment(article_id, comment_id)
    .then(deleteComment => res.status(204).send({ deleteComment }))
    .catch(next);
};
