const articlesRouter = require('express').Router();


const {
  getArticles, getArticlesById,
} = require('../controllers/articles');

articlesRouter.get('/', getArticles);
articlesRouter.get('/:article_id', getArticlesById);


module.exports = articlesRouter;
