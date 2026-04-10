const db = require('../../db/knex');
const { applyQueryFilters } = require('../helpers/applyQueryFilters');

const baseQuery = () => db('history_archive').select('*');

exports.getArchivedHistory = async query => {
  const archivedHistory = await applyQueryFilters(baseQuery(), query);

  return archivedHistory;
};

exports.getArchivedHistoryById = async id => {
  return await baseQuery().where('history_archive.id', id).first();
};

exports.createArchivedHistory = async archivedHistoryData => {
  const [archivedHistory] = await db('history_archive')
    .insert(archivedHistoryData)
    .returning('*');

  return archivedHistory;
};

// exports.updateArchivedHistory = async (
//   archivedHistoryId,
//   archivedHistoryData,
// ) => {
//   const [archivedHistory] = await baseQuery()
//     .where('id', archivedHistoryId)
//     .update(archivedHistoryData)
//     .returning('*');

//   return archivedHistory;
// };

// exports.deleteArchivedHistory = async id => {
//   return await baseQuery().where('id', id).del().returning('*');
// };
