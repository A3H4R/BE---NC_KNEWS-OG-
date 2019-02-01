const connection = require('../connection');

exports.fetchArticles = (limit = 10, sort_by = 'created_at', order = 'desc', p) => connection('articles')
  .select('articles.article_id', 'articles.username AS author', 'topic', 'title', 'articles.body', 'articles.votes', 'articles.created_at')
  .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
  .groupBy('articles.article_id')
  .count('comments.comment_id as comment_count')
  .orderBy(sort_by, order)
  .limit(limit)
  .offset(p);

exports.fetchArticlesById = article_id => connection('articles')
  .select('articles.article_id', 'articles.username AS author', 'topic', 'title', 'articles.body', 'articles.votes', 'articles.created_at')
  .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
  .groupBy('articles.article_id')
  .count('comments.comment_id as comment_count')
  .where('articles.article_id', '=', article_id);
// .orderBy(sort_by, order)
// .limit(limit)
// .offset(p);
