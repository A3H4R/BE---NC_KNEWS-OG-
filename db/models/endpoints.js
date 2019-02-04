exports.allEndpointsObj = {
  '/api/topics': 'Shows all the News Topics',
  '/api/topics/:topic/articles':
      'Shows all the News Articles for one Specific Topic',
  '/api/articles': 'Shows all the News Articles',
  '/api/articles/:article_id':
      'Shows the News Article associated to a Specific Article Id',
  '/api/articles/:article_id/comments':
      'Shows all Comments for a particular Article Id',
  '/api/articles/:article_id/comments/:comment_id':
      'Shows the comment associated to a Comment Id for a particular Article associated to a specific Article Id',
  '/api/users': 'Shows all users',
  '/api/users/:username': 'Shows a specific user\'s data associated to a unique username',
  '/api/users/:username/articles':
      'Shows all the articles associated to a specific username',
};
