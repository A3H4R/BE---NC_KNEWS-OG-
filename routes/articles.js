const articlesRouter = require('express').Router();


const {
  getArticles, getArticlesById, updateVote,
} = require('../controllers/articles');

articlesRouter.get('/', getArticles);
articlesRouter.route('/:article_id').get(getArticlesById)
  .patch(updateVote);


module.exports = articlesRouter;
