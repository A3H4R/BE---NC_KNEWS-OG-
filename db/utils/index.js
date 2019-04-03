const { commentData, articleData } = require('../data');

exports.formatArticles = data => articleData.map((article) => {
    const { created_by, created_at, ...restOfArticle } = article;
    return {
      username: created_by,
      created_at: new Date(created_at),
      ...restOfArticle,
    };
  });

exports.formatComments = (data, ref) => commentData.map((comment) => {
    const {
 created_by, created_at, belongs_to, ...restOfComment 
} = comment;
    return {
      article_id: ref[belongs_to],
      username: created_by,
      created_at: new Date(created_at),
      ...restOfComment,
    };
  });

exports.createRef = function (article_row, article_name, article_id) {
  return article_row.reduce((acc, cur) => {
    acc[cur[article_name]] = cur[article_id];
    return acc;
  }, {});
};
