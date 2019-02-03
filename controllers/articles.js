const {
  fetchArticles, fetchArticlesById, changeVote, removeArticle,
  fetchCommentsFromArticle, createComment, addVoteToComment,
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

  changeVote(article_id, inc_vote)
    .then(([article]) => {
      if (typeof inc_vote !== 'number') {
        next({ status: 400, message: 'value for vote must must be a number' });
      } else if (!inc_vote) next({ status: 400, message: 'input for updating vote is missing' });
      else {
        res.status(200).send({ article });
      }
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  removeArticle(article_id)
    .then(deleteArticle => res.status(204).send({ deleteArticle }))
    .catch(next);
};

exports.getCommentsFromArticle = (req, res, next) => {
  const {
    limit, sort_by, sort_ascending, p,
  } = req.query;
  const { article_id } = req.params;

  let order;

  const commentsFromArticle = () => {
    fetchCommentsFromArticle(article_id, limit, sort_by, order, p)
      .then((comments) => {
        if (comments.length === 0) next({ status: 404, message: 'no comments found for this article' });
        else res.status(200).send({ comments });
      })
      .catch(next);
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
    .then(([newComment]) => res.status(201).send({ newComment }))
    .catch(next);
};


exports.updateCommentVote = (req, res, next) => {
  const { inc_vote = 0 } = req.body;
  const { article_id, comment_id } = req.params;

  addVoteToComment(article_id, comment_id, inc_vote)
    .then(([comment]) => {
      if (typeof inc_vote !== 'number') {
        next({ status: 400, message: 'value for vote must must be a number' });
      } else if (!inc_vote) next({ status: 400, message: 'input for updating vote is missing' });
      else {
        res.status(200).send({ comment });
      }
    })
    .catch(next);
};
