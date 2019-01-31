const connection = require('../connection');

exports.fetchTopics = () => connection('topics').select('*');

exports.addTopic = newTopic => connection('topics').insert(newTopic).returning('*');

exports.fetchArticlesByTopic = (topic, limit = 10, sort_by = 'created_at', order = 'desc', p) => connection('articles')
  .select('articles.article_id', 'articles.username AS author', 'topic', 'title', 'articles.body', 'articles.votes', 'articles.created_at')
  .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
  .groupBy('articles.article_id')
  .count('comments.comment_id as comment_count')
  .where('topic', '=', topic)
  .orderBy(sort_by, order)
  .limit(limit)
  .offset(p);

exports.addArticle = newArticle => connection('articles').insert(newArticle).returning('*');

// .select('*')
//   .where('topic', '=', topic)
//   .orderBy(sort_by, order)
//   .limit(limit)
//   .offset(p);
