const endItemsModels = require('../models/endItemsModels');

exports.getAllEndItems = async query => {
  return await endItemsModels.getAllEndItems(query);
};

exports.getEndItemById = async id => {
  const endItem = await endItemsModels.getEndItemById(id);

  if (!endItem) {
    const error = new Error('End item does not exist.');
    error.status = 404;
    throw error;
  }

  return endItem;
};

exports.createEndItem = async ({ fsc, description, niin, image, auth_qty, lin }) => {
  if (!fsc || !description || !niin) {
    const error = new Error('fsc, description, and niin are required.');
    error.status = 400;
    throw error;
  }

  return await endItemsModels.createEndItem({ fsc, description, niin, image, auth_qty, lin });
};

exports.updateEndItem = async (id, endItemData) => {
  const existingEndItem = await endItemsModels.getEndItemById(id);

  if (!existingEndItem) {
    const error = new Error('End item does not exist.');
    error.status = 404;
    throw error;
  }

  return await endItemsModels.updateEndItem(id, endItemData);
};

exports.deleteEndItem = async id => {
  const existingEndItem = await endItemsModels.getEndItemById(id);

  if (!existingEndItem) {
    const error = new Error('End item does not exist.');
    error.status = 404;
    throw error;
  }

  const [deletedEndItem] = await endItemsModels.deleteEndItem(id);
  return deletedEndItem;
};
