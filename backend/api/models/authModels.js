const db = require('../../db/knex');

const baseQuery = () =>
  db('users')
    .join('ranks', 'users.rank_id', 'ranks.id')
    .join('uics', 'users.uic_id', 'uics.id')
    .select(
      'users.id',
      'users.username',
      'users.name_first',
      'users.name_last',
      'users.email',
      'users.password',
      'users.phone',
      'users.created_at',
      'users.updated_at',
      'users.role',
      'users.dodid',
      'users.uic_id',
      'ranks.rank',
      'uics.uic',
    );

exports.createUser = async user => {
  return await db('users')
    .insert(user)
    .returning([
      'id',
      'username',
      'name_first',
      'name_last',
      'email',
      'phone',
      'created_at',
      'updated_at',
      'role',
      'uic_id',
      'rank_id',
      'dodid',
    ]);
};

exports.createUserRole = async (userId, roleId) => {
  return await db('users_roles').insert({ user_id: userId, role_id: roleId });
};

exports.findUserById = async id => {
  return await baseQuery().where('users.id', id).first();
};

exports.findUserByEmail = async email => {
  return await baseQuery().where('email', email).first();
};

exports.findUserByUsername = async username => {
  return await baseQuery().where('username', username).first();
};
