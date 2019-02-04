const connection = require('../connection');

exports.totalArticles = () => connection('articles')
  .count('articles.article_id as total_count')
  .returning('*');

exports.fetchArticles = (limit = 10, sort_by = 'created_at', order = 'desc', p = 1) => connection('articles')
  .select('articles.article_id', 'articles.username AS author', 'topic', 'title', 'articles.body', 'articles.votes', 'articles.created_at')
  .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
  .groupBy('articles.article_id')
  .count('comments.comment_id as comment_count')
  .orderBy(sort_by, order)
  .limit(limit)
  .offset((p - 1) * limit);


exports.fetchArticlesById = (article_id, limit = 10, sort_by = 'created_at', order = 'desc', p = 1) => connection('articles')
  .select('articles.article_id', 'articles.username AS author', 'topic', 'title', 'articles.body', 'articles.votes', 'articles.created_at')
  .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
  .groupBy('articles.article_id')
  .count('comments.comment_id as comment_count')
  .where('articles.article_id', '=', article_id)
  .orderBy(sort_by, order)
  .limit(limit)
  .offset((p - 1) * limit);


exports.changeVote = (article_id, inc_vote) => connection('articles').where('articles.article_id', '=', article_id).increment('votes', inc_vote).returning('*');

exports.removeArticle = article_id => connection('articles').where('articles.article_id', '=', article_id).del();

exports.fetchCommentsFromArticle = (article_id, limit = 10, sort_by = 'created_at', order, p = 1) => connection('comments')
  .select('comment_id', 'comments.username AS author', 'comments.votes', 'comments.created_at', 'comments.body')
  .join('articles', 'comments.article_id', '=', 'articles.article_id')
  .where('articles.article_id', '=', article_id)
  .orderBy(sort_by, order)
  .limit(limit)
  .offset((p - 1) * limit);


exports.createComment = newComment => connection('comments').insert(newComment).returning('*');

exports.addVoteToComment = (article_id, comment_id, inc_vote) => connection('comments').where('comments.comment_id', '=', comment_id).increment('votes', inc_vote).returning('*');

exports.removeComment = (article_id, comment_id) => connection('comments').where('comments.comment_id', '=', comment_id).del();
