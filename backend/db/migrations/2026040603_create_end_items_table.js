exports.up = function(knex) {
  return knex.schema.createTable('end_items', table => {
    table.increments('id');
    table.varchar('fsc', 50)
    table.text('description')
    table.integer('niin', 50).notNullable();
    table.integer('auth_qty', 50);
    table.integer('lin');
    table.string('image');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('end_items');
};