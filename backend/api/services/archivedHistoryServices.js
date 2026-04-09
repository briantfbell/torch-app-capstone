const archivedHistoryModels = require('../models/archivedHistoryModels');

exports.getArchivedHistory = async query => {
  return await archivedHistoryModels.getArchivedHistory(query);
};

exports.getArchivedHistoryById = async id => {
  const currentArchivedHistory =
    await archivedHistoryModels.getArchivedHistoryById(id);

  if (!currentArchivedHistory) {
    const error = new Error('This current history id does not exist.');
    error.status = 404;
    throw error;
  }

  return currentArchivedHistory;
};

exports.createArchivedHistory = async ({
  end_item_id,
  user_id,
  seen,
  location,
  last_seen,
  count_current,
}) => {
  if (
    !end_item_id ||
    !user_id ||
    !seen ||
    !location ||
    !last_seen ||
    !count_current
  ) {
    const error = new Error('All fields are required.');
    error.status = 400;
    throw error;
  }

  return await archivedHistoryModels.createArchivedHistory({
    end_item_id,
    user_id,
    seen,
    location,
    last_seen,
    count_current,
  });
};

exports.updateArchivedHistory = async (id, currentArchivedHistoryData) => {
  const existingArchivedHistory =
    await archivedHistoryModels.getArchivedHistoryById(id);

  if (!existingArchivedHistory) {
    const error = new Error('This current history id does not exist.');
    error.status = 404;
    throw error;
  }

  return await archivedHistoryModels.updateArchivedHistory(
    id,
    currentArchivedHistoryData,
  );
};

exports.deleteArchivedHistory = async id => {
  const existingArchivedHistory =
    await archivedHistoryModels.getArchivedHistoryById(id);

  if (!existingArchivedHistory) {
    const error = new Error('This current history id does not exist.');
    error.status = 404;
    throw error;
  }

  const [deletedArchivedHistory] =
    await archivedHistoryModels.deleteArchivedHistory(id);
  return deletedArchivedHistory;
};
