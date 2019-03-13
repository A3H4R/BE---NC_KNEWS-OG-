const {
  fetchAllUsers,
  createUser,
  fetchArticlesByUsername,
  fetchUser,
  totalArticlesByUsername,
} = require('../db/models/users');

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then(users => res.status(200).send({ users }))
    .catch(next);
};

exports.addUser = (req, res, next) => {
  const { username, avatar_url, name } = req.body;

  createUser({ username, avatar_url, name })
    .then(([newUser]) => res.status(201).send({ newUser }))
    .catch(next);
};
exports.getUser = (req, res, next) => {
  const { username } = req.params;

  fetchUser(username)
    .then(([user]) => {
      if (!user) {
        return Promise.reject({
          status: 404,
          message: 'Username does not exist',
        });
      }
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.getArticlesByUsername = (req, res, next) => {
  const {
    limit, sort_by, order, p,
  } = req.query;

  const { username } = req.params;

  Promise.all([
    fetchArticlesByUsername(username, limit, sort_by, order, p),
    totalArticlesByUsername(username),
  ])
    .then(([articles, total_count]) => {
      if (articles.length === 0) {
        return Promise.reject({
          status: 404,
          message: 'No articles for this user',
        });
      }
      res.status(200).send({ articles, total_count });
    })
    .catch(err => next(err));
};
