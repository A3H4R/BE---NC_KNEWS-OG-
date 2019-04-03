exports.handle422 = (err, req, res, next) => {
  const codes = {
    23505: 'Topic already exists',
  };
  if (codes[err.code]) {
    res.status(422).send({ message: `${codes[err.code]}` });
  } else next(err);
};

exports.handle400 = (err, req, res, next) => {
  const codes = {
    23502: 'A required field is empty',
    23503: 'Username does not exist',
    '22P02': 'Input must be a number',
  };
  if (codes[err.code]) {
    res.status(400).send({ message: `${codes[err.code]}` });
  } else if (err.status === 400) {
    res.status(400).send({ message: `${err.message}` });
  } else next(err);
};

exports.handle404 = (err, req, res, next) => {
  const codes = {
    22003: 'Article Not Found',
  };
  if (codes[err.code]) {
    res.status(404).send({ message: `${codes[err.code]}` });
  } else if (err.status === 404) {
    res.status(404).send({ message: `${err.message}` });
  } else {
    next(err);
  }
};

exports.handle405 = (req, res) => {
  res.status(405).send({ message: 'Method Not Allowed' });
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ message: 'Internal server error' });
};
