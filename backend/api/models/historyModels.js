const db = require('../../db/knex');
const { applyQueryFilters } = require('../helpers/applyQueryFilters');

const baseQuery = () => db('history').select('*');

exports.getAllHistory = async query => {
  const history = await applyQueryFilters(baseQuery(), query);

  return history;
};

exports.getHistoryById = async id => {
  return await baseQuery().where('history.id', id).first();
};

exports.createHistory = async historyData => {
  const [history] = await db('history').insert(historyData).returning('*');

  return history;
};

exports.updateHistory = async (historyId, historyData) => {
  const [history] = await baseQuery()
    .where('id', historyId)
    .update(historyData)
    .returning('*');

  return history;
};

exports.deleteHistory = async id => {
  return await baseQuery().where('id', id).del().returning('*');
};
