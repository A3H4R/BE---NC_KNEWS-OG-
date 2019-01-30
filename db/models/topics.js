const connection = require('../connection');

exports.fetchTopics = () => connection('topics').select('*');

exports.addTopic = newTopic => connection('topics').insert(newTopic).returning('*');

exports.fetchArticlesByTopic = (topic, limit = 10, sort_by = 'created_at', p, order = 'desc') => connection('articles').select('*').limit(limit).where('topic', '=', topic)
  .orderBy(sort_by);


// select * from articles where topic = 'coding' ORDER BY created_at DESC ;
