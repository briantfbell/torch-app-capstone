const currentHistoryModels = require('../models/currentHistoryModels');

exports.getAllCurrentHistory = async query => {
  return await currentHistoryModels.getAllCurrentHistory(query);
};

exports.getCurrentHistoryById = async id => {
  const currentCurrentHistory =
    await currentHistoryModels.getCurrentHistoryById(id);

  if (!currentCurrentHistory) {
    const error = new Error('This current history id does not exist.');
    error.status = 404;
    throw error;
  }

  return currentCurrentHistory;
};

exports.createCurrentHistory = async ({
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

  return await currentHistoryModels.createCurrentHistory({
    end_item_id,
    user_id,
    seen,
    location,
    last_seen,
    count_current,
  });
};

exports.updateCurrentHistory = async (id, currentCurrentHistoryData) => {
  const existingCurrentHistory =
    await currentHistoryModels.getCurrentHistoryById(id);

  if (!existingCurrentHistory) {
    const error = new Error('This current history id does not exist.');
    error.status = 404;
    throw error;
  }

  return await currentHistoryModels.updateCurrentHistory(
    id,
    currentCurrentHistoryData,
  );
};

exports.deleteCurrentHistory = async id => {
  const existingCurrentHistory =
    await currentHistoryModels.getCurrentHistoryById(id);

  if (!existingCurrentHistory) {
    const error = new Error('This current history id does not exist.');
    error.status = 404;
    throw error;
  }

  const [deletedCurrentHistory] =
    await currentHistoryModels.deleteCurrentHistory(id);
  return deletedCurrentHistory;
};
