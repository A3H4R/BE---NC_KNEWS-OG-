const connection = require('../db/connection');

exports.getTopics = (req, res, next) => {
  connection('topics').select('*')
    .then(topics => res.status(200).send({ topics }))
    .catch(next);
};

exports.createTopic = (req, res, next) => {
  const { slug, description } = req.body;
  if (!{ slug, description }) return Promise.reject({ status: 404, message: 'invalid input data' });

  connection('topics')
    .returning('*').insert({ slug, description })
    .then(newTopic => res.status(201).send({ newTopic }))
    .catch(next);
};
