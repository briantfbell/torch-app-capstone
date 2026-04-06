const knex = require('knex');
const config = require('../api/knexfile');

const env = process.env.NODE_ENV || 'development';

if (!config[env]) {
  throw new Error(`Missing knex config for env ${env}`);
}

console.log(`Using DB env: ${env}`);

const db = knex(config[env]);

module.exports = db;
