const uicModels = require('../models/uicModels');

exports.getAllUics = async query => {
  return await uicModels.getAllUics(query);
};

exports.getUicById = async id => {
  const uic = await uicModels.getUicById(id);

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

  return await uicModels.createUic({ uic, unit_name, parent_uic });
};

exports.updateUic = async (id, uicData) => {
  const existingUic = await uicModels.getUicById(id);

  if (!existingUic) {
    const error = new Error('UIC does not exist.');
    error.status = 404;
    throw error;
  }

  return await uicModels.updateUic(id, uicData);
};

exports.deleteUic = async id => {
  const existingUic = await uicModels.getUicById(id);

  if (!existingUic) {
    const error = new Error('UIC does not exist.');
    error.status = 404;
    throw error;
  }

  const [deletedUic] = await uicModels.deleteUic(id);

  return deletedUic;
};
