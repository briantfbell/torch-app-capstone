exports.up = function(knex) {
  return knex.schema.createTable('ranks', table => {
    table.increments('id');
    table.varchar('rank', 50).notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('ranks');
};