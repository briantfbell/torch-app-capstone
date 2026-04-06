// TO DO: change route based on actual knex location
const db = require('../../db/knex');

const baseQuery = () =>
  db('users')
    .join('ranks', 'users.rank', 'ranks.rank')
    .join('uic', 'users.uic_id', 'uic.uic')
    .join('users_roles', 'users.id', 'users_roles.user_id')
    .join('roles', 'users_roles.role_id', 'roles.id')
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
      'roles.id as role_id',
      'roles.admin',
      'roles.hand_receipt_holder',
      'roles.sub_receipt_holder',
      'roles.temp_receipt_holder',
    );

// TO DO: if users end up with multiple roles

// const groupRoles = query => {
//   return query
//     .select('users.*')
//     .select(db.raw('ARRAY_AGG(roles.role) as roles'))
//     .groupBy('users.id');
// };

exports.createUser = async (user, roleId) => {
  return await db.transaction(async trx => {
    const [newUser] = await trx('users')
      .insert({
        username: user.username,
        name_first: user.name_first,
        name_last: user.name_last,
        email: user.email,
        password: user.password,
        phone: user.phone,
        rank: user.rank,
        uic_id: user.uic_id,
      })
      .returning('id');

    await trx('users_roles').insert({
      user_id: newUser.id,
      role_id: roleId,
    });

    return await trx('users')
      .join('ranks', 'users.rank', 'ranks.rank')
      .join('uic', 'users.uic_id', 'uic.uic')
      .join('users_roles', 'users.id', 'users_roles.user_id')
      .join('roles', 'users_roles.role_id', 'roles.id')
      .where('users.id', newUser.id)
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
        'roles.id as role_id',
        'roles.admin',
        'roles.hand_receipt_holder',
        'roles.sub_receipt_holder',
        'roles.temp_receipt_holder',
      )
      .first();
  });
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
