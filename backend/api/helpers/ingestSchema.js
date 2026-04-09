const schema = {
  lin: {
    column: 'LIN Number / DODIC',
    type: String,
  },
  fsc: {
    column: 'FSC',
    type: Number,
    required: true,
  },
  niin: {
    column: 'Material / NIIN',
    type: String,
  },
  description: {
    column: 'Material Description',
    type: String,
    required: true,
  },
  auth_qty: {
    column: 'Stock',
    type: Number,
    required: true,
  },
  ui: {
    column: 'Unit of Measure',
    type: String,
    required: true,
  },
  serial_number: {
    column: 'Serial Number',
    type: Number,
  },
};

module.exports = { schema };
