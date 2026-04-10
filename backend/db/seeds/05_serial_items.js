const { faker } = require('@faker-js/faker');

const createSerials = async num => {
  let temp = [];
  for (let i = 0; i < num; i++) {
    const randNum = faker.number.int({ min: 0, max: 3 });
    temp.push({
      item_id: faker.number.int({ min: 2, max: 21 }),
      serial_number: faker.string.numeric(10),
      user_id: faker.number.int({ min: 1, max: 29 }),
      status: 'serviceable',
    });
  }
  return temp;
};

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('serial_items').del();

  await knex.raw('ALTER SEQUENCE serial_items_id_seq RESTART WITH 1');

  await knex('serial_items').insert([...(await createSerials(30))]);
};
