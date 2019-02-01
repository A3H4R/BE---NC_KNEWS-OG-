const articlesRouter = require('express').Router();


const {
  getArticles, getArticlesById, updateVote, deleteArticleById, getCommentsFromArticle,
} = require('../controllers/articles');

articlesRouter.get('/', getArticles);
articlesRouter.route('/:article_id')
  .get(getArticlesById)
  .patch(updateVote)
  .delete(deleteArticleById);

articlesRouter.get('/:article_id/comments', getCommentsFromArticle);
module.exports = articlesRouter;
