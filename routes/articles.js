const articlesRouter = require('express').Router();

const { handle405 } = require('../errors/index');

const {
  getArticles, getArticlesById, updateVote, deleteArticleById,
  getCommentsFromArticle, addComment, updateCommentVote, deleteComment,
} = require('../controllers/articles');

articlesRouter.route('/')
  .get(getArticles)
  .all(handle405);

articlesRouter.route('/:article_id')
  .get(getArticlesById)
  .patch(updateVote)
  .delete(deleteArticleById)
  .all(handle405);

articlesRouter.route('/:article_id/comments')
  .get(getCommentsFromArticle)
  .post(addComment)
  .all(handle405);

articlesRouter.route('/:article_id/comments/:comment_id')
  .patch(updateCommentVote)
  .delete(deleteComment)
  .all(handle405);

module.exports = articlesRouter;
