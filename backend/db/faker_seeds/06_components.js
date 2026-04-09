const { faker } = require('@faker-js/faker');

const UI_OPTIONS = ['EA', 'PR', 'BX', 'DZ', 'SE', 'KT'];
const ARC_OPTIONS = ['A', 'B', 'C', 'X', 'N'];

const createComponents = async (num, endItemIds) => {
  let temp = [];
  for (let i = 0; i < num; i++) {
    temp.push({
      niin: faker.number.int({ min: 100000000, max: 999999999 }),
      description: faker.commerce.productDescription(),
      ui: faker.helpers.arrayElement(UI_OPTIONS),
      auth_qty: faker.number.int({ min: 1, max: 10 }),
      arc: faker.helpers.arrayElement(ARC_OPTIONS),
      end_item_id: faker.helpers.arrayElement(endItemIds),
    });
  }
  return temp;
};

exports.seed = async function (knex) {
  await knex('components').del();

  await knex.raw('ALTER SEQUENCE components_id_seq RESTART WITH 1');

  const endItems = await knex('end_items').select('id');
  const endItemIds = endItems.map(row => row.id);

  await knex('components').insert([
    ...(await createComponents(60, endItemIds)),
  ]);
};
