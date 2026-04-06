// TO DO: change route based on actual knex location
const db = require('../../db/knex');

const baseQuery = () =>
  db('users')
    .join('ranks', 'users.rank', 'ranks.rank')
    .join('uic', 'users.uic_id', 'uic.uic')
    .join('users_roles', 'users.id', 'users_roles.user_id')
    .join('roles', 'users_roles.role_id', 'roles.id');

// TO DO: can users have multiple roles?

// const groupRoles = query => {
//   return query
//     .select('users.*')
//     .select(db.raw('ARRAY_AGG(roles.role) as roles'))
//     .groupBy('users.id');
// };

exports.createUser = async user => {
  return await baseQuery()
    .insert(user)
    .returning([
      'id',
      'role',
      'username',
      'name_first',
      'name_last',
      'email',
      'phone',
      'created_at',
      'updated_at',
      'rank',
      'uic',
    ]);
};

exports.findUserById = async id => {
  return await baseQuery().where({ id: id }).first();
};

exports.findUserByEmail = async email => {
  return await baseQuery().select('*').where('email', email).first();
};

exports.findUserByUsername = async username => {
  return await baseQuery().select('*').where('username', username).first();
};
