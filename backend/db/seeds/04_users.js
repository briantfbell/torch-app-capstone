const { faker } = require('@faker-js/faker')
const bcrypt = require('bcrypt')

  const createUsers = async (num) => {
    const hashWord = await bcrypt.hash('password', 10)

    const rankArry = ["admin", "HRC", "sub-HRH", "THR"]
    let temp= []
    for(let i = 0; i < num; i++){
      const randNum = faker.number.int({ min: 0, max: 3})
      temp.push({
        username: faker.internet.username(),
        password: hashWord,
        name_first: faker.person.firstName(),
        name_last: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        phone: faker.phone.number(),
        rank_id: faker.number.int({ min: 2, max: 21 }),
        uic_id: faker.number.int({ min: 1, max: 2 }),
        role: rankArry[randNum],
        dodid: faker.string.numeric(10)
      })
    }
    return temp
  }


exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()

  await knex.raw("ALTER SEQUENCE users_id_seq RESTART WITH 1")

  await knex('users').insert([
    ... await createUsers(30)
  ]);
};