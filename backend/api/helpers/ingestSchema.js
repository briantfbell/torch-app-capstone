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
    column: 'Material / NIIN',
    type: String,
  },
  description: {
    column: 'Material Description',
    type: String,
  },
  auth_qty: {
    column: 'Stock',
    type: Number,
  },
  ui: {
    column: 'Unit of Measure',
    type: String,
  },
  serial_number: {
    column: 'Serial Number',
    type: Number,
  },
  end_item_lin: {
    column: 'END ITEM LIN',
    type: String,
  },
};

module.exports = { schema };
