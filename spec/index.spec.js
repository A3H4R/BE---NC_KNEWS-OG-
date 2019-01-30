process.env.NODE_ENV = 'test';
const { expect } = require('chai');

const supertest = require('supertest');
const connection = require('../db/connection');
const app = require('../app');

const request = supertest(app);

describe('./api', () => {
  beforeEach(() => connection.migrate.rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));

  after(() => {
    connection.destroy();
  });

  describe('/topics', () => {
    it('[[GET]] - [status 200] - responds with array of topic objects', () => request
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).to.be.an('array');
        expect(body.topics[0]).to.contain.keys('slug', 'description');
      }));
    it('[[POST]] - [status 201] - body accepts an object with slug and description property & responds with the posted topic object', () => {
      const newTopic = { description: 'Everything the light touches, is our kingdom', slug: 'The Lion King' };
      return request
        .post('/api/topics')
        .send(newTopic)
        .expect(201)
        .then(({ body }) => {
          expect(body.newTopic[0].description).to.equal(newTopic.description);
          expect(body.newTopic[0].slug).to.equal(newTopic.slug);
        });
    });
    it('[[POST]] - [status 400] gives error when description & slug property is empty', () => {
      const newTopic = { description: '', slug: '' };
      return request
        .post('/api/topics')
        .send(newTopic)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.equal('Bad Request');
        });
    });
  });
});
