exports.handle404 = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ message: 'Page does not exist' });
  } else {
    next(err);
  }
};

exports.handle400 = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({ message: 'Bad Request' });
  } else {
    next(err);
  }
};
