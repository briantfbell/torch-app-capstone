exports.up = function (knex) {
  return knex.schema.createTable('serial_end_items', table => {
    table.increments('id');
    table.varchar('serial_number', 50).unique();
    table.timestamp('assigned_at').defaultTo(knex.fn.now());
    table.string('status', 50);
    table.text('common_name');
    table.integer('end_item_id').unsigned();
    table.integer('user_id').unsigned();
    table
      .foreign('end_item_id')
      .references('id')
      .inTable('end_items')
      .onDelete('CASCADE');
    table
      .foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('serial_end_items');
};
