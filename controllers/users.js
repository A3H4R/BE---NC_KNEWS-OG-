
const {
  fetchAllUsers, createUser, fetchArticlesByUsername, fetchUser,
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
    .then(([user]) => res.status(200).send({ user }))
    .catch(next);
};

exports.getArticlesByUsername = (req, res, next) => {
  const {
    limit, sort_by, order, p,
  } = req.query;
  const { username } = req.params;
  fetchArticlesByUsername(username, limit, sort_by)
    .then(articles => res.status(200).send({ articles }))
    .catch(next);
};
