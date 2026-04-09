const { faker } = require('@faker-js/faker');

const createItems = async num => {
  let temp = [];
  for (let i = 0; i < num; i++) {
    temp.push({
      fsc: faker.number.int({ min: 1000, max: 6999 }),
      description: faker.commerce.productDescription(),
      niin: faker.string.numeric(9),
      auth_qty: faker.number.int({ min: 1, max: 3 }),
      lin: faker.string.alphanumeric(6),
    });
  }
  return temp;
};

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('end_items').del();

  await knex.raw('ALTER SEQUENCE end_items_id_seq RESTART WITH 1');

  await knex('end_items').insert([...(await createItems(30))]);
};
