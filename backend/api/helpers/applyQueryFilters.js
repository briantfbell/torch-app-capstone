// TO DO: match with actual db schema
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
  const { section_id, end_item_id } = filters;

  const { includeSort = true, includePagination = true } = options;

  const allowedSortFields = [
    'id',
    'title',
    'mgrs',
    'priority',
    'created_at',
    'classification',
  ];

  const allowedOrder = ['asc', 'desc'];

  // CATEGORY
  const selectedCategories = parseMultiValue(categories || category).filter(
    value => value !== 'all_categories',
  );

  if (selectedCategories.length) {
    query.whereIn('categories.category', selectedCategories);
  }

  // PRIORITY
  const selectedPriorities = parseMultiValue(priorities || priority).filter(
    value => value !== 'all_priorities',
  );

  if (selectedPriorities.length) {
    query.whereIn('reports.priority', selectedPriorities);
  }

  // ID
  if (id) {
    query.where('reports.id', id);
  }

  // TITLE
  if (title) {
    query.whereILike('reports.title', `%${title}%`);
  }

  // MGRS
  if (mgrs) {
    query.whereILike('reports.mgrs', `%${mgrs}%`);
  }

  // SUBMITTED BY
  if (submitted_by) {
    query.whereILike('users.email', `%${submitted_by}%`);
  }

  // PLAIN QUERY TEXT
  if (q) {
    query.where(text => {
      text
        .whereILike('reports.title', `%${q}%`)
        .orWhereILike('reports.mgrs', `%${q}%`)
        .orWhereILike('users.email', `%${q}%`);
    });
  }

  // DATES
  if (after) {
    query.where('reports.created_at', '>', after);
  }

  if (before) {
    query.where('reports.created_at', '<', before);
  }

  const dateRangeDays = {
    last_7_days: 7,
    last_30_days: 30,
    last_60_days: 60,
    last_90_days: 90,
    last_90_days: 90,
    last_6_months: 180,
    last_year: 365,
  };

  if (date_range && date_range !== 'all_dates' && dateRangeDays[date_range]) {
    const days = dateRangeDays[date_range];

    const cutoff = new Date();

    cutoff.setDate(cutoff.getDate() - days);

    query.where('reports.created_at', '>=', cutoff);
  }

  // CLASSIFICATION
  if (classification && classification !== 'all_classifications') {
    query.where('reports.classification', classification);
  }

  // SORT
  if (includeSort) {
    if (sort_by && allowedSortFields.includes(sort_by)) {
      const safeOrder = allowedOrder.includes(order) ? order : 'desc';
      query.orderBy(`reports.${sort_by}`, safeOrder);
    } else {
      query.orderBy('reports.created_at', 'desc');
    }
  }

  // LIMIT
  if (includePagination) {
    const parsedLimit = parseInt(limit, 10);
    if (!isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 100) {
      query.limit(parsedLimit);
    }

    // OFFSET
    const parsedOffset = parseInt(offset, 10);
    if (!isNaN(parsedOffset) && parsedOffset >= 0) {
      query.offset(parsedOffset);
    }
  }

  return query;
};
