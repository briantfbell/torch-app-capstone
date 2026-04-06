// TO DO: change route based on actual knex location
const db = require('../../db/knex');

const baseQuery = () =>
  db('users')
    .join('ranks', 'users.rank', 'ranks.id')
    .join('uic', 'users.uic_id', 'uic.id')
    .select(
      'users.id',
      'users.username',
      'users.name_first',
      'users.name_last',
      'users.email',
      'users.phone',
      'users.created_at',
      'users.updated_at',
      'users.role',
      'users.DoDID',
      'users.uic_id',
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
      'rank',
      'uic_id',
      'DoDID',
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
