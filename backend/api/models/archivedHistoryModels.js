const db = require('../../db/knex');
const { applyQueryFilters } = require('../helpers/applyQueryFilters');

// --- history_end_archive ---

const baseEndQuery = () => db('history_end_archive').select('*');

exports.getArchivedHistory = async query => {
  return await applyQueryFilters(baseEndQuery(), query);
};

exports.getArchivedHistoryById = async id => {
  return await baseEndQuery().where('history_end_archive.id', id).first();
};

exports.createArchivedHistory = async archivedHistoryData => {
  const [archivedHistory] = await db('history_end_archive')
    .insert(archivedHistoryData)
    .returning('*');

  return archivedHistory;
};

exports.deleteArchivedHistory = async id => {
  return await baseEndQuery().where('id', id).del().returning('*');
};

// --- history_component_archive ---

const baseComponentQuery = () => db('history_component_archive').select('*');

exports.getComponentArchivedHistory = async query => {
  return await applyQueryFilters(baseComponentQuery(), query);
};

exports.getComponentArchivedHistoryById = async id => {
  return await baseComponentQuery()
    .where('history_component_archive.id', id)
    .first();
};

exports.createComponentArchivedHistory = async archivedHistoryData => {
  const [archivedHistory] = await db('history_component_archive')
    .insert(archivedHistoryData)
    .returning('*');

  return archivedHistory;
};

exports.deleteComponentArchivedHistory = async id => {
  return await baseComponentQuery().where('id', id).del().returning('*');
};
