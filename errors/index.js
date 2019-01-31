exports.handle400 = (err, req, res, next) => {
  const codes = {
    23502: 'invalid input - violates not null violation',
    23503: 'username does not exist',
    '22P02': 'invalid input syntax for type integer',
  };
  if (codes[err.code]) res.status(400).send({ message: codes[err.code] });
  else next(err);
};

exports.handle404 = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ message: err.message });
  } else {
    next(err);
  }
};
