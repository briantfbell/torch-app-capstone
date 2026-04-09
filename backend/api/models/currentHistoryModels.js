const db = require('../../db/knex');
const { applyQueryFilters } = require('../helpers/applyQueryFilters');

const baseQuery = () => db('history_current').select('*');

exports.getAllCurrentHistory = async query => {
  const currentHistory = await applyQueryFilters(baseQuery(), query);

  return currentHistory;
};

exports.getCurrentHistoryById = async id => {
  return await baseQuery().where('history_current.id', id).first();
};

exports.createCurrentHistory = async currentHistoryData => {
  const [currentHistory] = await db('history_current')
    .insert(currentHistoryData)
    .returning('*');

  return currentHistory;
};

exports.updateCurrentHistory = async (currentHistoryId, currentHistoryData) => {
  const [currentHistory] = await baseQuery()
    .where('id', currentHistoryId)
    .update(currentHistoryData)
    .returning('*');

  return currentHistory;
};

exports.deleteCurrentHistory = async id => {
  return await baseQuery().where('id', id).del().returning('*');
};
