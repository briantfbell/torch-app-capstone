// Knex configuration file — used by both the Knex query builder at runtime
// and the Knex CLI for running migrations and seeds.
//
// DB team: connection values come from .env.development (or .env.production, etc.)
// See .env.example for required variable names.
// Migrations live in backend/db/migrations, seeds in backend/db/seeds.

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

module.exports = {
  development: {
    // Using PostgreSQL via the 'pg' driver
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      // Run `npx knex migrate:latest` from backend/api to apply pending migrations
      directory: '../db/migrations',
    },
    seeds: {
      // Run `npx knex seed:run` from backend/api to seed the database
      directory: '../db/seeds',
    },
  },
};
