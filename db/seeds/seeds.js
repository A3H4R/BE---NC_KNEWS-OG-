const {
  articleData, topicData, userData, commentData,
} = require('../data');
const { formatArticles, formatComments, createRef } = require('../utils/index');

exports.seed = function (knex, promise) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => knex('topics')
      .insert(topicData)
      .returning('*'))
    .then(() => knex('users')
      .insert(userData)
      .returning('*'))
    .then(() => {
      const formattedArticles = formatArticles(articleData);
      return knex('articles')
        .insert(formattedArticles)
        .returning('*');
    })
    .then((formattedArticleTable) => {
      const articleRef = createRef(
        formattedArticleTable,
        'title',
        'article_id',
      );
      const formattedcommentsData = formatComments(commentData, articleRef);
      return knex('comments')
        .insert(formattedcommentsData)
        .returning('*');
    });
};
