// change route based on actual knex location
const db = require('../../db/knex');

exports.createUser = async user => {
  return await db('users')
    .insert(user)
    .returning(['id', 'email', 'role', 'section']);
};

exports.findUserById = async id => {
  return await db('users').where({ id: id }).first();
};

exports.findUserByEmail = async email => {
  return await db('users').select('*').where('email', email).first();
};
