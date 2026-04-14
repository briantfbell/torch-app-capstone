exports.up = function (knex) {
  return knex.schema
    .alterTable('serial_end_items', table => {
      table.integer('uic_id').unsigned().nullable();
      table.foreign('uic_id').references('id').inTable('uics').onDelete('SET NULL');
    })
    .alterTable('serial_component_items', table => {
      table.integer('uic_id').unsigned().nullable();
      table.foreign('uic_id').references('id').inTable('uics').onDelete('SET NULL');
    });
};

exports.down = function (knex) {
  return knex.schema
    .alterTable('serial_end_items', table => {
      table.dropForeign(['uic_id']);
      table.dropColumn('uic_id');
    })
    .alterTable('serial_component_items', table => {
      table.dropForeign(['uic_id']);
      table.dropColumn('uic_id');
    });
};
