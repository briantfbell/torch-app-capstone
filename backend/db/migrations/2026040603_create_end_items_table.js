exports.up = function(knex) {
  return knex.schema.createTable('end_items', table => {
    table.increments('id');
    table.varchar('fsc', 50)
    table.text('description')
    table.string('niin', 9).notNullable();
    table.integer('auth_qty');
    table.string('lin', 6);
    table.string('image');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('end_items');
};