exports.up = function(knex) {
  return knex.schema.createTable('uics', table => {
    table.increments('id');
    table.varchar('uic', 50).notNullable();
    table.varchar('unit_name', 50);
    table.varchar('parent_uic', 50);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('uics');
};