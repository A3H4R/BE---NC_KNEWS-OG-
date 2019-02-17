// const knex = require('knex');

// const dbConfig = require('../knexfile');

// const connection = knex(dbConfig);

// module.exports = connection;

const ENV = process.env.NODE_ENV || 'development';
const config = ENV === 'production' ? { client: 'pg', connection: process.env.DATABASE_URL } : require('../knexfile');

module.exports = require('knex')(config);
