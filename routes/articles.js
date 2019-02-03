const articlesRouter = require('express').Router();


const {
  getArticles, getArticlesById, updateVote, deleteArticleById,
  getCommentsFromArticle, addComment, updateCommentVote, deleteComment,
} = require('../controllers/articles');

articlesRouter.get('/', getArticles);
articlesRouter.route('/:article_id')
  .get(getArticlesById)
  .patch(updateVote)
  .delete(deleteArticleById);

articlesRouter.route('/:article_id/comments')
  .get(getCommentsFromArticle)
  .post(addComment);

articlesRouter.route('/:article_id/comments/:comment_id')
  .patch(updateCommentVote)
  .delete(deleteComment);

module.exports = articlesRouter;
