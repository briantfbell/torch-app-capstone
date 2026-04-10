const schema = {
  lin: {
    column: 'LIN Number / DODIC',
    type: String,
  },
  fsc: {
    column: 'FSC',
    type: Number,
  },
  niin: {
    column: 'Material',
    type: String,
  },
  description: {
    column: 'Material Description',
    type: String,
  },
  auth_qty: {
    column: 'Stock',
    type: Number,
    value: 1,
  },
  ui: {
    column: 'Unit of Measure',
    type: String,
    value: 'EA',
  },
  serial_number: {
    column: 'Serial Number',
    type: Number,
  },
  end_item_lin: {
    // change to real document header
    column: 'End Item LIN',
    type: String,
  },
};

module.exports = { schema };
