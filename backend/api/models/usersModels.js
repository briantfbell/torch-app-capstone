const db = require('../../db/knex');
const { applyQueryFilters } = require('../helpers/applyQueryFilters');

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
      'users.phone',
      'users.created_at',
      'users.updated_at',
      'users.dodid',
      'users.role',
      'ranks.rank',
      'uics.uic',
      'uics.unit_name',
      'uics.parent_uic',
    );

exports.getAllUsers = async query => {
  return await applyQueryFilters(baseQuery(), query);
};

exports.getUserById = async id => {
  return await baseQuery().where('users.id', id).first();
};

exports.updateUser = async (userId, userUpdates) => {
  await db('users').where('id', userId).update(userUpdates);
  return await baseQuery().where('users.id', userId).first();
};

exports.deleteUser = async id => {
  const user = await baseQuery().where('users.id', id).first();
  await db('users').where('id', id).del();
  return user;
};
