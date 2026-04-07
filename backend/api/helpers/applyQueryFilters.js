const parseMultiValue = value => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.flatMap(item =>
      String(item)
        .split(',')
        .map(item => item.trim())
        .filter(Boolean),
    );
  }

  return String(value)
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
};

exports.applyQueryFilters = (query, filters, options = {}) => {
  const {
    id,
    description,
    niin,
    fsc,
    lin,
    arc,
    end_item_id,
    status,
    item_id,
    serial_number,
    signed_to,
    section_id,
    q,
    sort_by,
    order,
    limit,
    offset,
  } = filters;

  const {
    includeSort = true,
    includePagination = true,
    searchFields = ['description'],
  } = options;

  const allowedSortFields = [
    'id',
    'description',
    'niin',
    'fsc',
    'lin',
    'arc',
    'status',
    'serial_number',
    'assigned_at',
  ];

  const allowedOrder = ['asc', 'desc'];

  // ID
  if (id) {
    query.where('id', id);
  }

  // DESCRIPTION (end_items, components)
  if (description) {
    query.whereILike('description', `%${description}%`);
  }

  // NIIN (end_items, components)
  if (niin) {
    query.whereILike('niin', `%${niin}%`);
  }

  // FSC (end_items)
  if (fsc) {
    query.whereILike('fsc', `%${fsc}%`);
  }

  // LIN (end_items)
  if (lin) {
    query.whereILike('lin', `%${lin}%`);
  }

  // ARC (components)
  if (arc) {
    query.whereILike('arc', `%${arc}%`);
  }

  // END_ITEM_ID (components)
  if (end_item_id) {
    query.where('end_item_id', end_item_id);
  }

  // STATUS (serial_items) — supports comma-separated or array values
  const selectedStatuses = parseMultiValue(status).filter(
    value => value !== 'all_statuses',
  );

  if (selectedStatuses.length) {
    query.whereIn('status', selectedStatuses);
  }

  // ITEM_ID (serial_items)
  if (item_id) {
    query.where('item_id', item_id);
  }

  // SERIAL_NUMBER (serial_items)
  if (serial_number) {
    query.whereILike('serial_number', `%${serial_number}%`);
  }

  // SIGNED_TO (serial_items)
  if (signed_to) {
    query.where('signed_to', signed_to);
  }

  // SECTION_ID
  if (section_id) {
    query.where('section_id', section_id);
  }

  // PLAIN QUERY TEXT — searches across caller-specified searchFields
  if (q && searchFields.length) {
    query.where(builder => {
      searchFields.forEach((field, i) => {
        if (i === 0) {
          builder.whereILike(field, `%${q}%`);
        } else {
          builder.orWhereILike(field, `%${q}%`);
        }
      });
    });
  }

  // SORT
  if (includeSort) {
    if (sort_by && allowedSortFields.includes(sort_by)) {
      const safeOrder = allowedOrder.includes(order) ? order : 'asc';
      query.orderBy(sort_by, safeOrder);
    } else {
      query.orderBy('id', 'asc');
    }
  }

  // PAGINATION
  if (includePagination) {
    const parsedLimit = parseInt(limit, 10);
    if (!isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 100) {
      query.limit(parsedLimit);
    }

    const parsedOffset = parseInt(offset, 10);
    if (!isNaN(parsedOffset) && parsedOffset >= 0) {
      query.offset(parsedOffset);
    }
  }

  return query;
};
