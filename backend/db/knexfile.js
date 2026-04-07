require('dotenv').config({ path: require('path').join(__dirname, '.env') });

module.exports = {
  development: {
    client: process.env.POSTGRES_CLIENT,
    connection: {
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    },
  },
};
