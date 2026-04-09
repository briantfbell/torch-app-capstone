exports.up = function (knex) {
  return knex.schema.createTable('components', table => {
    table.increments('id');
    table.varchar('niin', 50).notNullable();
    table.text('description');
    table.string('ui', 50).defaultTo('EA').notNullable();
    table.integer('auth_qty', 50).defaultTo(1);
    table.string('image');
    table.string('arc');
    table.integer('end_item_id').unsigned();
    table.decimal('cost');
    table
      .foreign('end_item_id')
      .references('id')
      .inTable('end_items')
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('components');
};
