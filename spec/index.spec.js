process.env.NODE_ENV = 'test';
const { expect } = require('chai');

const supertest = require('supertest');
const connection = require('../db/connection');
const app = require('../app');

const request = supertest(app);

describe('./api', () => {
  beforeEach(() => connection.seed.run());

  after(() => {
    connection.destroy();
  });
  it('[[GET]] - [status 200] - responds with array of all the endpoints objects', () => request
    .get('/api/')
    .expect(200)
    .then(({ body }) => {
      expect(body.allEndpointsObj).to.have.all.keys(
        '/api/topics',
        '/api/topics/:topic/articles',
        '/api/articles',
        '/api/articles/:article_id',
        '/api/articles/:article_id/comments',
        '/api/articles/:article_id/comments/:comment_id',
        '/api/users',
        '/api/users/:username',
        '/api/users/:username/articles',
      );
    }));
  it('[[GET]] - [status 404] - responds with correct error when invalid route supplied to endpoint', () => request
    .get('/api/hellooooooo')
    .expect(404)
    .then(({ body }) => {
      expect(body.message).to.equal('Error Code: 404 : Page Not Found');
    }));
  it('[[POST]] - [status 405] - responds with error when invalid method used on endpoint', () => request
    .delete('/api')
    .expect(405)
    .then(({ body }) => {
      expect(body.message).to.equal('Error Code: 405 - Method Not Allowed');
    }));

  describe('/topics', () => {
    it('[[GET]] - [status 404] - responds with correct error when invalid route supplied to endpoint', () => request
      .get('/api/topics/break')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).to.equal('Error Code: 404 : Page Not Found');
      }));
    it('[[GET]] - [status 200] - responds with array of topic objects', () => request
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).to.be.an('array');
        expect(body.topics[0]).to.contain.keys('slug', 'description');
      }));
    it('[[POST]] - [status 201] - body accepts an object with slug and description property & responds with the posted topic object', () => {
      const newTopic = {
        description: 'Everything the light touches, is our kingdom',
        slug: 'The Lion King',
      };
      return request
        .post('/api/topics')
        .send(newTopic)
        .expect(201)
        .then(({ body }) => {
          expect(body.newTopic.description).to.equal(newTopic.description);
          expect(body.newTopic.slug).to.equal(newTopic.slug);
        });
    });
    it('[[POST]] - [status 400] gives error when description property is null (i.e - missing)', () => {
      const newTopic = { slug: 'Ronaldo' };
      return request
        .post('/api/topics')
        .send(newTopic)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.equal(
            'Error Code: 400 - invalid input - violates not null violation',
          );
        });
    });
    it('[[POST]] - [status 422] gives error when trying to post a topic that already exists', () => {
      const newTopic = { description: 'My Coding Journey', slug: 'mitch' };
      return request
        .post('/api/topics')
        .send(newTopic)
        .expect(422)
        .then(({ body }) => {
          expect(body.message).to.equal(
            'Error Code: 422 - duplicate key value violates unique constraint ----> Key (slug)=(mitch) already exists.',
          );
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
          expect(body.message).to.equal(
            'Error Code: 404 - topic does not exist',
          );
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
      it('[[GET]] - [status 200] - responds with the correct articles when page number not specified [DEFAULT CASE]', () => request
        .get('/api/topics/mitch/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.lengthOf('10');
          expect(body.articles[0].article_id).to.equal(1);
          expect(body.articles[9].article_id).to.equal(11);
        }));
      it('[[GET]] - [status 200] - responds with the correct articles when page number and limit specified', () => request
        .get('/api/topics/mitch/articles?limit=2&p=3')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.lengthOf('2');
          expect(body.articles[0].article_id).to.equal(6);
          expect(body.articles[1].article_id).to.equal(7);
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
        const newArticle = {
          title: 'What Do Cats Think About Us? ',
          body:
            "We've yet to discover anything about cat behavior that suggests they have a separate box they put us in when they're socializing with us.",
          username: 'butter_bridge',
        };
        return request
          .post('/api/topics/cats/articles')
          .send(newArticle)
          .expect(201)
          .then(({ body }) => {
            expect(body.newArticle.title).to.equal(newArticle.title);
            expect(body.newArticle.username).to.equal(newArticle.username);
          });
      });
      it('[[POST]] - [status 400] -  responds with error when posting new article with username that does not exist', () => {
        const newArticle = {
          title: 'What Do Cats Say About Us? ',
          body: "cat's don't speak, so we do not know.",
          username: 'cat_man738',
        };
        return request
          .post('/api/topics/cats/articles')
          .send(newArticle)
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.equal(
              'Error Code: 400 - username does not exist',
            );
          });
      });
      it('[[POST]] - [status 400] gives error if body property is null (i.e - missing) when posting new article', () => {
        const newArticle = {
          title: 'The Meaning of Life? ',
          username: 'butter_bridge',
        };
        return request
          .post('/api/topics/mitch/articles')
          .send(newArticle)
          .expect(400)
          .then(({ body }) => {
            expect(body.message).to.equal(
              'Error Code: 400 - invalid input - violates not null violation',
            );
          });
      });
    });
  });
  describe('/articles', () => {
    it('[[GET]] - [status 200] - responds with array of articles objects', () => request
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles[0]).to.have.all.keys(
          'title',
          'topic',
          'body',
          'created_at',
          'article_id',
          'author',
          'votes',
          'comment_count',
        );
      }));
    it('[[GET]] - [status 200] - defaults to giving back 10 article objects [-[DEFAULT CASE]-]', () => request
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.lengthOf('10');
      }));
    it('[[GET]] - [status 200] - takes a limit query and responds with correct number of article objects', () => request
      .get('/api/articles?limit=8')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.lengthOf('8');
      }));
    it('[[GET]] - [status 200] - defaults to ordering article objects by date [-[DEFAULT CASE]-]', () => request
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].article_id).to.equal(1);
        expect(body.articles[9].article_id).to.equal(10);
      }));
    it('[[GET]] - [status 200] - takes a sort_by query and responds with sorting article objects by specified column', () => request
      .get('/api/articles?sort_by=title')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Z');
        expect(body.articles[9].title).to.equal(
          'Does Mitch predate civilisation?',
        );
      }));
    it('[[GET]] - [status 200] - responds with the correct articles when page number not specified [DEFAULT CASE]', () => request
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.lengthOf('10');
        expect(body.articles[0].article_id).to.equal(1);
        expect(body.articles[9].article_id).to.equal(10);
      }));
    it('[[GET]] - [status 200] - responds with the correct articles when page number and limit specified', () => request
      .get('/api/articles/?limit=2&p=3')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.lengthOf('2');
        expect(body.articles[0].article_id).to.equal(5);
        expect(body.articles[1].article_id).to.equal(6);
      }));
    it('[[GET]] - [status 200] - defaults with article objects ordered in descending order [-[DEFAULT CASE]-]', () => request
      .get('/api/articles?sort_by=article_id')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].article_id).to.equal(12);
        expect(body.articles[9].article_id).to.equal(3);
      }));
    it('[[GET]] - [status 200] - takes order query responds with article objects ordered in ascending order', () => request
      .get('/api/articles?sort_by=article_id&order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].article_id).to.equal(1);
        expect(body.articles[9].article_id).to.equal(10);
      }));
  });
  describe('/api/articles/:article_id', () => {
    it('[[GET]] - [status 400] - responds with error when incorrect article_id supplied to URL', () => request
      .get('/api/articles/bread22')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).to.equal(
          'Error Code: 400 - invalid input syntax for type integer',
        );
      }));
    it('[[GET]] - [status 200] - responds with specified article object ', () => request
      .get('/api/articles/4')
      .expect(200)
      .then(({ body }) => {
        expect(body.article).to.contain.keys(
          'title',
          'topic',
          'body',
          'created_at',
          'article_id',
          'author',
          'votes',
          'comment_count',
        );
        expect(body.article.article_id).to.equal(4);
      }));
    it('[[GET]] - [status 404] - responds with error when article_id does not exist', () => request
      .get('/api/articles/900')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).to.equal('Error Code: 404 - Article Not Found');
      }));
    it('[[GET]] - [status 404] - responds with error when article_id is out of range', () => request
      .get('/api/articles/1111111111111111111111111111111')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).to.equal('Error Code: 404 - Article Not Found');
      }));
    it('[[PATCH]] - [status 200] - takes a body and increments the article votes by number specified ', () => {
      const newVote = { inc_vote: 25 };
      return request
        .patch('/api/articles/4')
        .send(newVote)
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.equal(25);
          expect(body.article.article_id).to.equal(4);
        });
    });
    it('[[PATCH]] - [status 400] - gives an error when inc_vote = string ', () => {
      const newVote = { inc_vote: 'wrong input' };
      return request
        .patch('/api/articles/3')
        .send(newVote)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.equal(
            'Error Code: 400 - value for vote must be a number',
          );
        });
    });
    it('[[PATCH]] - [status 400] - gives an error when inc_vote is missing ', () => {
      const newVote = {};
      return request
        .patch('/api/articles/2')
        .send(newVote)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.equal(
            'Error Code: 400 - input for updating vote is missing',
          );
        });
    });
    it('[[DELETE]] - [status 204] - deletes the specified article', () => request
      .delete('/api/articles/6')
      .expect(204)
      .then(({ body }) => {
        expect(body).to.eql({});
      }));
    it('[[DELETE]] - [status 400] - throws error when given incorrect article_id', () => request
      .delete('/api/articles/coffee')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).to.equal(
          'Error Code: 400 - invalid input syntax for type integer',
        );
      }));
  });
  describe('/api/articles/:article_id/comments', () => {
    it('[[GET]] - [status 200] - responds with array of topic objects', () => request
      .get('/api/articles/5/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.be.an('array');
        expect(body.comments[0]).to.have.all.keys(
          'comment_id',
          'votes',
          'body',
          'author',
          'created_at',
        );
        expect(body.comments).to.have.lengthOf(2);
      }));
    it('[[GET]] - [status 404] - throws error when article has 0 comments', () => request
      .get('/api/articles/4/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).to.equal(
          'Error Code: 404 - no comments found for this article',
        );
      }));
    it('[[GET]] - [status 400] - throws error when article_id is a string', () => request
      .get('/api/articles/animals/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).to.equal(
          'Error Code: 400 - invalid input syntax for type integer',
        );
      }));
    it('[[GET]] - [status 200] - defaults to giving back 10 comment objects [-[DEFAULT CASE]-]', () => request
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.have.lengthOf('10');
      }));
    it('[[GET]] - [status 200] - takes a limit query and responds with correct number of comment objects', () => request
      .get('/api/articles/1/comments?limit=5')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.have.lengthOf('5');
      }));
    it('[[GET]] - [status 200] - defaults to ordering comment objects by date [-[DEFAULT CASE]-]', () => request
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[0].comment_id).to.equal(2);
        expect(body.comments[9].comment_id).to.equal(11);
      }));
    it('[[GET]] - [status 200] - takes a sort_by query and responds with sorting comment objects by specified column', () => request
      .get('/api/articles/1/comments/?sort_by=body')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[0].body).to.equal(
          'This morning, I showered for nine minutes.',
        );
        expect(body.comments[9].body).to.equal('git push origin master');
      }));
    it('[[GET]] - [status 200] - responds with the correct articles when page number not specified [DEFAULT CASE]', () => request
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.have.lengthOf('10');
        expect(body.comments[0].comment_id).to.equal(2);
        expect(body.comments[9].comment_id).to.equal(11);
      }));
    it('[[GET]] - [status 200] - responds with the correct articles when page number and limit specified', () => request
      .get('/api/articles/1/comments/?limit=2&p=3')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.have.lengthOf('2');
        expect(body.comments[0].comment_id).to.equal(6);
        expect(body.comments[1].comment_id).to.equal(7);
      }));
    it('[[GET]] - [status 200] - defaults with comment objects ordered in descending order [-[DEFAULT CASE]-]', () => request
      .get('/api/articles/1/comments?sort_by=comment_id')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[0].author).to.equal('butter_bridge');
        expect(body.comments[0].comment_id).to.equal(18);
        expect(body.comments[9].author).to.equal('icellusedkars');
        expect(body.comments[9].comment_id).to.equal(5);
      }));
    it('[[GET]] - [status 200] - takes order query responds with comment objects ordered in ascending order', () => request
      .get('/api/articles/1/comments?sort_by=comment_id&sort_ascending=true')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[0].author).to.equal('butter_bridge');
        expect(body.comments[0].comment_id).to.equal(2);
        expect(body.comments[9].author).to.equal('icellusedkars');
        expect(body.comments[9].comment_id).to.equal(11);
      }));
    it('[[POST]] - [status 201] - body accepts an object with username and body properties & responds with the posted comment object', () => {
      const newComment = {
        username: 'butter_bridge',
        body: 'This article is a great read',
      };
      return request
        .post('/api/articles/8/comments')
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.newComment.username).to.eql(newComment.username);
          expect(body.newComment.body).to.equal(newComment.body);
        });
    });
    it('[[POST]] - [status 400] gives error when username property is null (i.e - missing)', () => {
      const newComment = { body: 'Fantastic article to read' };
      return request
        .post('/api/articles/3/comments')
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.equal(
            'Error Code: 400 - invalid input - violates not null violation',
          );
        });
    });
  });
  describe('/api/articles/:article_id/comments/:comment_id', () => {
    it('[[PATCH]] - [status 200] - takes a body and increments the article votes by number specified ', () => {
      const newVote = { inc_vote: 77 };
      return request
        .patch('/api/articles/9/comments/1')
        .send(newVote)
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.equal(93);
          expect(body.comment.comment_id).to.equal(1);
        });
    });
    it('[[PATCH]] - [status 400] - gives an error when inc_vote = string ', () => {
      const newVote = { inc_vote: 'wrong input' };
      return request
        .patch('/api/articles/9/comments/1')
        .send(newVote)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.equal(
            'Error Code: 400 - value for vote must be a number',
          );
        });
    });
    it('[[PATCH]] - [status 400] - gives an error when inc_vote is missing ', () => {
      const newVote = {};
      return request
        .patch('/api/articles/9/comments/1')
        .send(newVote)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.equal(
            'Error Code: 400 - input for updating vote is missing',
          );
        });
    });
    it('[[DELETE]] - [status 204] - deletes the specified comment', () => request
      .delete('/api/articles/6/comments/16')
      .expect(204)
      .then(({ body }) => {
        expect(body).to.eql({});
      }));
    it('[[DELETE]] - [status 400] - throws error when given incorrect comment_id', () => request
      .delete('/api/articles/6/comments/Northcoders')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).to.equal(
          'Error Code: 400 - invalid input syntax for type integer',
        );
      }));
  });

  describe('/api/users', () => {
    it('[[GET]] - [status 200] - responds with array of user objects', () => request
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(body.users).to.be.an('array');
        expect(body.users[0]).to.contain.all.keys(
          'username',
          'avatar_url',
          'name',
        );
      }));
    it('[[POST]] - [status 201] - body accepts an object with username, name and avatar+url properties & responds with creating a new user', () => {
      const newUser = {
        username: 'Ronaldo007',
        avatar_url:
          'https://img.allfootballapp.com/www/M00/0D/75/480x-/-/-/rB8ApFt31wmAGPTGAAAsYwIaGlw539.jpg',
        name: 'Cristiano',
      };
      return request
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .then(({ body }) => {
          expect(body.newUser.username).to.eql(newUser.username);
          expect(body.newUser.name).to.eql(newUser.name);
        });
    });
    it('[[POST]] - [status 400] gives error when avtar_url property is null (i.e - missing)', () => {
      const newUser = { username: 'messi89', name: 'lionel' };
      return request
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).to.equal(
            'Error Code: 400 - invalid input - violates not null violation',
          );
        });
    });
  });
  describe('/api/users/:username', () => {
    it('[[GET]] - [status 200] - responds with specified user object', () => request
      .get('/api/users/icellusedkars')
      .expect(200)
      .then(({ body }) => {
        expect(body.user).to.be.an('object');
        expect(body.user).to.have.all.keys('username', 'avatar_url', 'name');
      }));
    it('[[GET]] - [status 404] - throws error when specified user does not exist', () => request
      .get('/api/users/JoseMouriniho')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).to.equal(
          'Error Code: 404 - username does not exist',
        );
      }));
  });
  describe('/api/users/:username/articles', () => {
    it('[[GET]] - [status 200] - responds with article objects created by the specified user', () => request
      .get('/api/users/icellusedkars/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles[0]).to.have.all.keys(
          'author',
          'topic',
          'article_id',
          'votes',
          'title',
          'created_at',
          'comment_count',
        );
      }));
    it('[[GET]] - [status 404] - throws error when specified user does not exist', () => request
      .get('/api/users/spiderman491/articles')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).to.equal(
          'Error Code: 404 - No articles for this user',
        );
      }));
    it('[[GET]] - [status 200] - defaults to giving back 10 article objects [-[DEFAULT CASE]-]', () => request
      .get('/api/users/icellusedkars/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.lengthOf('6');
      }));
    it('[[GET]] - [status 200] - takes a limit query and responds with correct number of article objects', () => request
      .get('/api/users/icellusedkars/articles?limit=3')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.lengthOf('3');
      }));
    it('[[GET]] - [status 200] - defaults to ordering article objects by date [-[DEFAULT CASE]-]', () => request
      .get('/api/users/icellusedkars/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].created_at).to.equal(
          '2014-11-16T12:21:54.171Z',
        );
        expect(body.articles[5].created_at).to.equal(
          '1978-11-25T12:21:54.171Z',
        );
      }));
    it('[[GET]] - [status 200] - takes a sort_by query and responds with sorting article objects by specified column', () => request
      .get('/api/users/icellusedkars/articles/?sort_by=title')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Z');
        expect(body.articles[5].title).to.equal('A');
      }));
    it('[[GET]] - [status 200] - responds with the correct articles when page number not specified [DEFAULT CASE]', () => request
      .get('/api/users/icellusedkars/articles/')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.lengthOf('6');
        expect(body.articles[0].article_id).to.equal(2);
        expect(body.articles[5].article_id).to.equal(11);
      }));
    it('[[GET]] - [status 200] - responds with the correct articles when page number and limit specified', () => request
      .get('/api/users/icellusedkars/articles/?limit=2&p=3')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.lengthOf('2');
        expect(body.articles[0].article_id).to.equal(8);
        expect(body.articles[1].article_id).to.equal(11);
      }));
    it('[[GET]] - [status 200] - defaults with article objects ordered in descending order [-[DEFAULT CASE]-]', () => request
      .get('/api/users/icellusedkars/articles/?sort_by=article_id')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].article_id).to.equal(11);
        expect(body.articles[5].article_id).to.equal(2);
      }));
    it('[[GET]] - [status 200] - takes order query responds with article objects ordered in ascending order', () => request
      .get('/api/users/icellusedkars/articles/?sort_by=article_id&order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].article_id).to.equal(2);
        expect(body.articles[5].article_id).to.equal(11);
      }));
  });
});
