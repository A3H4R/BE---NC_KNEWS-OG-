exports.handle400 = (err, req, res, next) => {
  const codes = {
    23502: 'invalid input - violates not null violation',
    23503: 'username does not exist',
    '22P02': 'invalid input syntax for type integer',
  };
  if (codes[err.code]) res.status(400).send({ message: `Error Code: ${res.statusCode} - ${codes[err.code]}` });
  else if (err.status === 400) {
    res.status(400).send({ message: `Error Code: ${res.statusCode} - ${err.message}` });
  } else next(err);
};

exports.handle405 = (err, req, res, next) => {
  if (err.status === 405) {
    res.status(405).send({ message: `Error Code: ${res.statusCode} - Method Not Allowed` });
  }
};

exports.handle404 = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ message: `Error Code: ${res.statusCode} - ${err.message}` });
  } else {
    next(err);
  }
};


exports.handle500 = (err, req, res, next) => {
  if (err.status === 500) {
    res.status(500).send({ message: `${res.statusCode} - internal server error` });
  } else {
    next(err);
  }
};
