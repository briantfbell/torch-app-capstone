const archivedHistoryEndItemsModels = require('../models/archivedHistoryEndItemsModels');

exports.getArchivedHistory = async query => {
  return await archivedHistoryEndItemsModels.getArchivedHistory(query);
};

exports.getArchivedHistoryById = async id => {
  const record = await archivedHistoryEndItemsModels.getArchivedHistoryById(id);

  if (!record) {
    const error = new Error('This archived history id does not exist.');
    error.status = 404;
    throw error;
  }

  return record;
};

exports.createArchivedHistory = async ({
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

  return await archivedHistoryEndItemsModels.createArchivedHistory({
    end_item_id,
    user_id,
    seen,
    location,
    last_seen,
    serial_number,
  });
};

exports.deleteArchivedHistory = async id => {
  const existing =
    await archivedHistoryEndItemsModels.getArchivedHistoryById(id);

  if (!existing) {
    const error = new Error('This archived history id does not exist.');
    error.status = 404;
    throw error;
  }

  const [deleted] =
    await archivedHistoryEndItemsModels.deleteArchivedHistory(id);
  return deleted;
};
