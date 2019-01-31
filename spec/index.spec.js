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
    it('[[POST]] - [status 400] gives error when description property is null (i.e - missing)', () => {
      const newTopic = { slug: 'Ronaldo' };
      return request
        .post('/api/topics')
        .send(newTopic)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.equal('invalid input - violates not null violation');
        });
    });
    describe('/topics/:topic/articles', () => {
      it('[[GET]] - [status 200] - responds with array of articles with specified topic', () => request
        .get('/api/topics/mitch/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles[0].topic).to.equal('mitch');
          expect(body.articles[0]).to.contain.keys('author', 'comment_count');
        }));
      it('[[GET]] - [status 404] - responds with error when topic does not exist', () => request
        .get('/api/topics/france/articles')
        .expect(404)
        .then(({ body }) => {
          expect(body.message).to.equal('topic does not exist');
        }));
      it('[[GET]] - [status 200] - defaults to giving back 10 article objects [-[DEFAULT CASE]-]', () => request
        .get('/api/topics/mitch/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.lengthOf('10');
        }));
      it('[[GET]] - [status 200] - takes a limit query and responds with correct number of article objects', () => request
        .get('/api/topics/mitch/articles?limit=5')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.lengthOf('5');
        }));
      it('[[GET]] - [status 200] - defaults to ordering article objects by date [-[DEFAULT CASE]-]', () => request
        .get('/api/topics/mitch/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].article_id).to.equal(1);
          expect(body.articles[9].article_id).to.equal(11);
        }));
      it('[[GET]] - [status 200] - takes a sort_by query and responds with sorting article objects by specified column', () => request
        .get('/api/topics/mitch/articles?sort_by=title')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].title).to.equal('Z');
          expect(body.articles[9].title).to.equal('Am I a cat?');
        }));
      it('[[GET]] - [status 200] - responds with article objects skipping rows to the specified offset value', () => request
        .get('/api/topics/mitch/articles?p=3')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.lengthOf('8');
        }));
      it('[[GET]] - [status 200] - defaults with article objects ordered in descending order [-[DEFAULT CASE]-]', () => request
        .get('/api/topics/mitch/articles?sort_by=article_id')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].article_id).to.equal(12);
          expect(body.articles[9].article_id).to.equal(2);
        }));
      it('[[GET]] - [status 200] - takes order query responds with article objects ordered in ascending order', () => request
        .get('/api/topics/mitch/articles?sort_by=article_id&order=asc')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].article_id).to.equal(1);
          expect(body.articles[9].article_id).to.equal(11);
        }));
      it('[[POST]] - [status 201] - body accepts an object with title, body, username properties & responds with the posted new article object', () => {
        const newArticle = { title: 'What Do Cats Think About Us? ', body: 'We\'ve yet to discover anything about cat behavior that suggests they have a separate box they put us in when they\'re socializing with us.', username: 'butter_bridge' };
        return request
          .post('/api/topics/cats/articles')
          .send(newArticle)
          .expect(201)
          .then(({ body }) => {
            expect(body.newArticle[0].title).to.equal(newArticle.title);
            expect(body.newArticle[0].username).to.equal(newArticle.username);
          });
      });
      it('[[POST]] - [status 400] -  responds with error when posting new article with username that does not exist', () => {
        const newArticle = { title: 'What Do Cats Say About Us? ', body: 'cat\'s don\'t speak, so we do not know.', username: 'cat_man738' };
        return request
          .post('/api/topics/cats/articles')
          .send(newArticle)
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.equal('username does not exist');
          });
      });
      it('[[POST]] - [status 400] gives error if body property is null (i.e - missing) when posting new article', () => {
        const newArticle = { title: 'The Meaning of Life? ', username: 'butter_bridge' };
        return request
          .post('/api/topics/mitch/articles')
          .send(newArticle)
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.equal('invalid input - violates not null violation');
          });
      });
    });
  });
});
