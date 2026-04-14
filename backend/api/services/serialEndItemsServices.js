const serialEndItemsModels = require('../models/serialEndItemsModels');

exports.getAllSerialEndItems = async query => {
  return await serialEndItemsModels.getAllSerialEndItems(query);
};

exports.getSerialEndItemById = async id => {
  const serialEndItem = await serialEndItemsModels.getSerialEndItemById(id);

  if (!serialEndItem) {
    const error = new Error('Serial item does not exist.');
    error.status = 404;
    throw error;
  }

  return serialEndItem;
};

exports.getSerialEndItemsByUicId = async uic_id => {
  const serialEndItems =
    await serialEndItemsModels.getSerialEndItemsByUicId(uic_id);

  if (!serialEndItems) {
    const error = new Error(
      'Either the UIC does not exist or no serial items recorded.',
    );
    error.status = 404;
    throw error;
  }

  return serialEndItems;
};

exports.createSerialEndItem = async serialEndItemData => {
  const { end_item_lin, serial_number, user_dodid, status } = serialEndItemData;

  if (!serial_number || !user_dodid || !status || !end_item_lin) {
    const error = new Error('All fields are required.');
    error.status = 400;
    throw error;
  }

  return await serialEndItemsModels.createSerialEndItem(
    {
      serial_number,
      status,
    },
    end_item_lin,
    user_dodid,
  );
};

exports.updateSerialEndItem = async (serialEndItemId, serialEndItemData) => {
  const existingSerialEndItem =
    await serialEndItemsModels.getSerialEndItemById(serialEndItemId);

  if (!existingSerialEndItem) {
    const error = new Error('Serial item does not exist.');
    error.status = 404;
    throw error;
  }

  return await serialEndItemsModels.updateSerialEndItem(
    serialEndItemId,
    serialEndItemData,
  );
};

exports.deleteSerialEndItem = async id => {
  const existingSerialEndItem =
    await serialEndItemsModels.getSerialEndItemById(id);

  if (!existingSerialEndItem) {
    const error = new Error('Serial item does not exist.');
    error.status = 404;
    throw error;
  }

  const [deletedSerialEndItem] =
    await serialEndItemsModels.deleteSerialEndItem(id);

  return deletedSerialEndItem;
};
