const connection = require('../connection');

exports.totalArticlesByTopic = topic => connection('articles')
    .count('articles.article_id as total_count')
    .where('topic', '=', topic)
    .returning('*')
    .then(countArray => countArray[0].total_count);

exports.fetchTopics = () => connection('topics').select('*');

exports.addTopic = newTopic => connection('topics')
    .insert(newTopic)
    .returning('*');

exports.fetchArticlesByTopic = (
  topic,
  limit = 10,
  sort_by = 'created_at',
  order = 'desc',
  p = 1,
) => connection('articles')
    .select(
      'articles.article_id',
      'articles.username AS author',
      'topic',
      'title',
      'articles.body',
      'articles.votes',
      'articles.created_at',
    )
    .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
    .groupBy('articles.article_id')
    .count('comments.comment_id as comment_count')
    .where('topic', '=', topic)
    .orderBy(sort_by, order)
    .limit(limit)
    .offset((p - 1) * limit);

exports.addArticle = newArticle => connection('articles')
    .insert(newArticle)
    .returning('*');
