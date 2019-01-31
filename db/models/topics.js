const connection = require('../connection');

exports.fetchTopics = () => connection('topics').select('*');

exports.addTopic = newTopic => connection('topics').insert(newTopic).returning('*');

exports.fetchArticlesByTopic = (topic, limit = 10, sort_by = 'created_at', order = 'desc', p) => connection('articles').select('*')
  .where('topic', '=', topic)
  .orderBy(sort_by, order)
  .limit(limit)
  .offset(p);


// select * from articles where topic = 'coding' ORDER BY created_at DESC ;
