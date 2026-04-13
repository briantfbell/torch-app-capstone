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
  image: {
    // change to real document header
    column: 'img',
    type: String,
  },
  // cost: {
  //   column: 'Cost',
  //   type: Number
  // }
};

// Strips spaces, underscores, and lowercases for fuzzy header matching
const normalizeStr = (str) => String(str).toLowerCase().replace(/[\s_]/g, '');

// Build a lookup from normalized column name -> canonical column name
const columnLookup = Object.fromEntries(
  Object.values(schema).map(({ column }) => [normalizeStr(column), column])
);

// Replaces header cells in the first row with the canonical column name when
// a case/space/underscore-insensitive match is found, so parseData can match them.
const normalizeHeaders = (data) => {
  if (!data || data.length === 0) return data;
  const [headers, ...rest] = data;
  const normalizedHeaders = headers.map((cell) => {
    if (cell == null) return cell;
    return columnLookup[normalizeStr(cell)] ?? cell;
  });
  return [normalizedHeaders, ...rest];
};

module.exports = { schema, normalizeHeaders };
