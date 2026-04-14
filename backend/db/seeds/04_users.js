const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

const createUsers = async num => {
  const hashWord = await bcrypt.hash('password', 10);
  const roleArray = ['admin', 'hrh', 'sub-hrh', 'thr'];

  let temp = [
    {
      username: 'hrh',
      password: hashWord,
      name_first: 'hrh',
      name_last: 'hrh',
      email: 'hrh',
      phone: faker.phone.number(),
      rank_id: faker.number.int({ min: 2, max: 21 }),
      uic_id: faker.number.int({ min: 1, max: 2 }),
      role: ['hrh'],
      dodid: faker.string.numeric(10),
    },
    {
      username: 'admin',
      password: hashWord,
      name_first: 'admin',
      name_last: 'admin',
      email: 'admin',
      phone: faker.phone.number(),
      rank_id: faker.number.int({ min: 2, max: 21 }),
      uic_id: faker.number.int({ min: 1, max: 2 }),
      role: ['admin'],
      dodid: faker.string.numeric(10),
    },
  ];
  for (let i = 0; i < num; i++) {
    const randNum = faker.number.int({ min: 0, max: 3 });
    temp.push({
      username: faker.internet.username(),
      password: hashWord,
      name_first: faker.person.firstName(),
      name_last: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.number(),
      rank_id: faker.number.int({ min: 2, max: 21 }),
      uic_id: faker.number.int({ min: 1, max: 2 }),
      role: [roleArray[randNum]],
      dodid: faker.string.numeric(10),
    });
  }
  return temp;
};

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del();

  await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');

  await knex('users').insert([...(await createUsers(1))]);
};
