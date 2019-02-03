const connection = require('../connection');

exports.fetchAllUsers = () => connection('users')
  .select('*');
//   .orderBy(sort_by, order)
//   .limit(limit)
//   .offset(p);
exports.createUser = newUser => connection('users').insert(newUser).returning('*');

exports.fetchUser = username => connection('users').select('*').where('username', '=', username);

exports.fetchArticlesByUsername = (username, limit = 10, sort_by = 'created_at') => connection('articles').select('articles.article_id', 'articles.username AS author', 'topic', 'title', 'articles.votes', 'articles.created_at')
  .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
  .groupBy('articles.article_id')
  .count('comments.comment_id as comment_count')
  .where('articles.username', '=', username)
  .orderBy(sort_by)
  .limit(limit);
//   .offset(p);
