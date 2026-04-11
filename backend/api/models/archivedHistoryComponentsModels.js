const db = require('../../db/knex');
const { applyQueryFilters } = require('../helpers/applyQueryFilters');

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
