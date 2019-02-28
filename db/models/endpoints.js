exports.allEndpointsObj = {
  '/api': 'Shows all the available endpoints',
  '/api/topics': 'Shows all the news topics',
  '/api/topics/:topic/articles':
    'Shows all the news articles for one specific topic',
  '/api/articles': 'Shows all the news articles',
  '/api/articles/:article_id':
    'Shows the news article associated to a specific article id',
  '/api/articles/:article_id/comments':
    'Shows all Comments for a particular article id',
  '/api/articles/:article_id/comments/:comment_id':
    'Shows the comment associated to a comment id for a particular article associated to a specific article id',
  '/api/users': 'Shows all users',
  '/api/users/:username':
    "Shows a specific user's data associated to a unique username",
  '/api/users/:username/articles':
    'Shows all the articles associated to a specific username',
};
