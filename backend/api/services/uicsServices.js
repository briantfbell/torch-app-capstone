const uicsModels = require('../models/uicsModels');

exports.getAllUics = async query => {
  return await uicsModels.getAllUics(query);
};

exports.getUicById = async id => {
  const uic = await uicsModels.getUicById(id);

  if (!uic) {
    const error = new Error('UIC does not exist.');
    error.status = 404;
    throw error;
  }

  return uic;
};

exports.createUic = async ({ uic, unit_name, parent_uic }) => {
  if (!uic || !unit_name || !parent_uic) {
    const error = new Error('All fields are required.');
    error.status = 400;
    throw error;
  }

  return await uicsModels.createUic({ uic, unit_name, parent_uic });
};

exports.updateUic = async (id, uicData) => {
  const existingUic = await uicsModels.getUicById(id);

  if (!existingUic) {
    const error = new Error('UIC does not exist.');
    error.status = 404;
    throw error;
  }

  return await uicsModels.updateUic(id, uicData);
};

exports.deleteUic = async id => {
  const existingUic = await uicsModels.getUicById(id);

  if (!existingUic) {
    const error = new Error('UIC does not exist.');
    error.status = 404;
    throw error;
  }

  const [deletedUic] = await uicsModels.deleteUic(id);

  return deletedUic;
};
