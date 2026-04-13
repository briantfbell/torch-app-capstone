exports.up = function (knex) {
  return knex.schema.createTable('serial_component_items', table => {
    table.increments('id');
    table.varchar('serial_number', 50).unique();
    table.timestamp('assigned_at').defaultTo(knex.fn.now());
    table.string('status', 50);
    table.text('note');
    table.text('common_name');
    table.integer('component_id').unsigned();
    table.integer('user_id').unsigned();
    table
      .foreign('component_id')
      .references('id')
      .inTable('components')
      .onDelete('CASCADE');
    table
      .foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('serial_component_items');
};
