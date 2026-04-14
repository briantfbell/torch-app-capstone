const serialComponentsModel = require('../models/serialComponentsModels');

exports.getAllSerialComponentItems = async query => {
  return await serialComponentsModel.getAllSerialComponentItems(query);
};

exports.getSerialComponentItemById = async id => {
  const serialComponentItem =
    await serialComponentsModel.getSerialComponentItemById(id);

  if (!serialComponentItem) {
    const error = new Error('Serial component item does not exist.');
    error.status = 404;
    throw error;
  }

  return serialComponentItem;
};

exports.getSerialComponentItemsByUicId = async uic_id => {
  const serialComponentItems =
    await serialComponentsModel.getSerialComponentItemsByUicId(uic_id);

  if (!serialComponentItems) {
    const error = new Error(
      'Either the UIC does not exist or no serial component items recorded.',
    );
    error.status = 404;
    throw error;
  }

  return serialComponentItems;
};

exports.createSerialComponentItem = async serialComponentItemData => {
  const { component_id, user_id, serial_number, status } =
    serialComponentItemData;

  if (!serial_number || !user_id || !status || !component_id) {
    const error = new Error('All fields are required.');
    error.status = 400;
    throw error;
  }

  return await serialComponentsModel.createSerialComponentItem(
    { serial_number, status },
    component_id,
    user_id,
  );
};

exports.updateSerialComponentItem = async (id, serialComponentItemData) => {
  const existingSerialComponentItem =
    await serialComponentsModel.getSerialComponentItemById(id);

  if (!existingSerialComponentItem) {
    const error = new Error('Serial component item does not exist.');
    error.status = 404;
    throw error;
  }

  return await serialComponentsModel.updateSerialComponentItem(
    id,
    serialComponentItemData,
  );
};

exports.deleteSerialComponentItem = async id => {
  const existingSerialComponentItem =
    await serialComponentsModel.getSerialComponentItemById(id);

  if (!existingSerialComponentItem) {
    const error = new Error('Serial component item does not exist.');
    error.status = 404;
    throw error;
  }

  const [deletedSerialComponentItem] =
    await serialComponentsModel.deleteSerialComponentItem(id);

  return deletedSerialComponentItem;
};
