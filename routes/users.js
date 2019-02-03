const usersRouter = require('express').Router();


const {
  getAllUsers, addUser, getUser, getArticlesByUsername,
} = require('../controllers/users');

usersRouter.route('/')
  .get(getAllUsers)
  .post(addUser);

usersRouter.get('/:username', getUser);

usersRouter.route('/:username/articles')
  .get(getArticlesByUsername);


module.exports = usersRouter;
