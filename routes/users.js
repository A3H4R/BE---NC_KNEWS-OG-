const usersRouter = require('express').Router();
const { handle405 } = require('../errors/index');


const {
  getAllUsers, addUser, getUser, getArticlesByUsername,
} = require('../controllers/users');

usersRouter.route('/')
  .get(getAllUsers)
  .post(addUser)
  .all(handle405);

usersRouter.route('/:username')
  .get(getUser)
  .all(handle405);

usersRouter.route('/:username/articles')
  .get(getArticlesByUsername)
  .all(handle405);

module.exports = usersRouter;
