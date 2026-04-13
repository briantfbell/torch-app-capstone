const db = require('../../db/knex');
const { applyQueryFilters } = require('../helpers/applyQueryFilters');

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
