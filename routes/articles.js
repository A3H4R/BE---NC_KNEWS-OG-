const articlesRouter = require('express').Router();


const {
  getArticles, getArticlesById, updateVote, deleteArticleById, getCommentsFromArticle, addComment,
} = require('../controllers/articles');

articlesRouter.get('/', getArticles);
articlesRouter.route('/:article_id')
  .get(getArticlesById)
  .patch(updateVote)
  .delete(deleteArticleById);

articlesRouter.route('/:article_id/comments')
  .get(getCommentsFromArticle)
  .post(addComment);

module.exports = articlesRouter;
