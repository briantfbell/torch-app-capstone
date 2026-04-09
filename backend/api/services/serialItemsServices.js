const serialItemsModels = require('../models/serialItemsModels');

exports.getAllSerialItems = async query => {
  return await serialItemsModels.getAllSerialItems(query);
};

exports.getSerialItemById = async id => {
  const serialItem = await serialItemsModels.getSerialItemById(id);

  if (!serialItem) {
    const error = new Error('Serial item does not exist.');
    error.status = 404;
    throw error;
  }

  return serialItem;
};

exports.createSerialItem = async serialItemData => {
  const { end_item_lin, serial_number, user_dodid, status } = serialItemData;

  if (!serial_number || !user_dodid || !status || !end_item_lin) {
    const error = new Error('All fields are required.');
    error.status = 400;
    throw error;
  }

  return await serialItemsModels.createSerialItem(
    {
      serial_number,
      status,
    },
    end_item_lin,
    user_dodid,
  );
};

exports.updateSerialItem = async (serialItemId, serialItemData) => {
  const existingSerialItem =
    await serialItemsModels.getSerialItemById(serialItemId);

  if (!existingSerialItem) {
    const error = new Error('Serial item does not exist.');
    error.status = 404;
    throw error;
  }

  return await serialItemsModels.updateSerialItem(serialItemId, serialItemData);
};

exports.deleteSerialItem = async id => {
  const existingSerialItem = await serialItemsModels.getSerialItemById(id);

  if (!existingSerialItem) {
    const error = new Error('Serial item does not exist.');
    error.status = 404;
    throw error;
  }

  const [deletedSerialItem] = await serialItemsModels.deleteSerialItem(id);

  return deletedSerialItem;
};
