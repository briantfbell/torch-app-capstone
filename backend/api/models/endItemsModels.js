const db = require('../../db/knex');
const { applyQueryFilters } = require('../helpers/applyQueryFilters');

const baseQuery = () =>
  db('reports')
    .join('report_categories', 'reports.id', 'report_categories.report_id')
    .join('categories', 'report_categories.category_id', 'categories.id')
    .join('users', 'reports.submitted_by', 'users.id');

const joinAllTables = query => {
  return query
    .select(
      'reports.id',
      'reports.title',
      'reports.mgrs',
      'reports.lat_long',
      'reports.priority',
      'reports.summary',
      'reports.recommendations',
      'reports.submitted_by',
      'users.email as submitted_by_email',
      'reports.created_at',
      'reports.classification',
    )
    .select(db.raw('ARRAY_AGG(categories.category) as categories'))
    .groupBy(
      'reports.id',
      'reports.title',
      'reports.mgrs',
      'reports.lat_long',
      'reports.priority',
      'reports.summary',
      'reports.recommendations',
      'reports.submitted_by',
      'users.email',
      'reports.created_at',
      'reports.classification',
    );
};

exports.getAllReports = async query => {
  const reports = await applyQueryFilters(joinAllTables(baseQuery()), query);

  return [reports];
};

exports.getReportById = async id => {
  return await joinAllTables(baseQuery()).where('reports.id', id).first();
};

exports.getReportsByCategory = async category => {
  return await joinAllTables(baseQuery()).whereRaw(
    'LOWER(categories.category) = LOWER(?)',
    [category],
  );
};

exports.createReport = async (trx, reportData) => {
  const [report] = await trx('reports').insert(reportData).returning('*');
  return report;
};

exports.updateReport = async (trx, reportId, reportData) => {
  const [report] = await trx('reports')
    .where('id', reportId)
    .update(reportData)
    .returning('*');

  return report;
};

exports.getReportCategories = async reportId => {
  return await db('report_categories')
    .join('categories', 'report_categories.category_id', 'categories.id')
    .where('report_categories.report_id', reportId)
    .select('categories.category');
};

exports.deleteReportCategories = async (trx, reportId) => {
  return await trx('report_categories').where('report_id', reportId).del();
};

exports.createReportCategories = async (trx, categoryLinks) => {
  return await trx('report_categories').insert(categoryLinks);
};

exports.deleteReport = async id => {
  return await db('reports').where('id', id).del().returning('*');
};
