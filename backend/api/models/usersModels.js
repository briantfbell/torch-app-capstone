const db = require('../../db/knex');
const { applyQueryFilters } = require('../helpers/applyQueryFilters');

const baseQuery = () =>
  db('users')
    .join('ranks', 'users.rank', 'ranks.rank')
    .join('uic', 'users.uic_id', 'uic.uic')
    .select(
      'users.id',
      'users.username',
      'users.name_first',
      'users.name_last',
      'users.email',
      'users.phone',
      'users.created_at',
      'users.updated_at',
      'ranks.rank',
      'uic.uic',
    );

// TO DO: if users end up with multiple roles

// const groupRoles = query => {
//   return query
//     .select('users.*')
//     .select(db.raw('ARRAY_AGG(roles.role) as roles'))
//     .groupBy('users.id');
// };

exports.getAllUsers = async query => {
  const users = await applyQueryFilters(baseQuery(), query);

  return [users];
};

exports.getUserById = async id => {
  return await baseQuery().where('users.id', id).first();
};

exports.updateUser = async (userId, userUpdates) => {
  const [user] = await db('users')
    .where('id', userId)
    .update(userUpdates)
    .returning('*');

  return user;
};

exports.deleteUser = async id => {
  return await db('users').where('id', id).del().returning('*');
};
