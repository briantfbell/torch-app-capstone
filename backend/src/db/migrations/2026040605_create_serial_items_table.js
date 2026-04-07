exports.up = function(knex) {
  return knex.schema.createTable('serial_items', table => {
    table.increments('id');
    table.varchar('serial_number', 50).unique();
    table.timestamp('assigned_at');
    table.string('status', 50).notNullable();
    table.integer('item_id').unsigned();
    table.integer('user_id').unsigned();
    table
      .foreign('item_id')
      .references('id')
      .inTable('end_items')
      .onDelete("CASCADE")
    table
      .foreign('user_id')
      .references('id')
      .inTable('users')
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('serial_items');
};