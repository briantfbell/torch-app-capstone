const db = require('../../db/knex');
const { applyQueryFilters } = require('../helpers/applyQueryFilters');

const baseQuery = () => db('uic').select('*');

exports.getAllUics = async query => {
  return await applyQueryFilters(baseQuery(), query, { searchFields: ['uic'] });
};

exports.getUicById = async id => {
  return await baseQuery().where('id', id).first();
};

exports.createUic = async uicData => {
  const [uic] = await db('uic').insert(uicData).returning('*');

  return uic;
};

exports.updateUic = async (uicId, uicData) => {
  const [uic] = await baseQuery()
    .where('id', uicId)
    .update(uicData)
    .returning('*');

  return uic;
};

exports.deleteUic = async id => {
  return await db('uic').where('id', id).del().returning('*');
};
