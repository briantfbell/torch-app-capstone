const currentHistoryEndItemsModels = require('../models/currentHistoryEndItemsModels');
const serialEndItemsModels = require('../models/serialEndItemsModels');

exports.getCurrentHistory = async query => {
  return await currentHistoryEndItemsModels.getCurrentHistory(query);
};

exports.getCurrentHistoryById = async id => {
  const record = await currentHistoryEndItemsModels.getCurrentHistoryById(id);

  if (!record) {
    const error = new Error('This current history id does not exist.');
    error.status = 404;
    throw error;
  }

  return record;
};

exports.getCurrentHistoryBySn = async sn => {
  const record = await currentHistoryEndItemsModels.getCurrentHistoryBySn(sn);

  return record;
};

exports.createCurrentHistory = async ({
  end_item_id,
  user_id,
  seen,
  location,
  last_seen,
  serial_number,
}) => {
  if (
    !end_item_id ||
    !user_id ||
    seen == null ||
    !location ||
    !last_seen ||
    !serial_number
  ) {
    const error = new Error('All fields are required.');
    error.status = 400;
    throw error;
  }

  const serial_end_item =
    await serialEndItemsModels.getSerialEndItemBySn(serial_number);

  return await currentHistoryEndItemsModels.createCurrentHistory({
    end_item_id,
    user_id,
    seen,
    location,
    last_seen,
    serial_number: serial_end_item.id,
  });
};

exports.updateCurrentHistory = async (id, currentHistoryData) => {
  const existing = await currentHistoryEndItemsModels.getCurrentHistoryById(id);

  if (!existing) {
    const error = new Error('This current history id does not exist.');
    error.status = 404;
    throw error;
  }

  if (currentHistoryData.serial_number) {
    const conflict = await currentHistoryEndItemsModels.getCurrentHistoryBySn({
      serial_number: currentHistoryData.serial_number,
    });
    if (conflict && conflict.id !== id) {
      const error = new Error(
        `Serial number ${currentHistoryData.serial_number} already has a current history record.`,
      );
      error.status = 409;
      throw error;
    }
  }

  return await currentHistoryEndItemsModels.updateCurrentHistory(
    id,
    currentHistoryData,
  );
};

exports.deleteCurrentHistory = async id => {
  const existing = await currentHistoryEndItemsModels.getCurrentHistoryById(id);

  if (!existing) {
    const error = new Error('This current history id does not exist.');
    error.status = 404;
    throw error;
  }

  const [deleted] = await currentHistoryEndItemsModels.deleteCurrentHistory(id);
  return deleted;
};
