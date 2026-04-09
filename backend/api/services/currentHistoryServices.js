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
  fsc,
  description,
  niin,
  image,
  auth_qty,
  lin,
}) => {
  if (!fsc || !description || !niin || !image || !auth_qty || !lin) {
    const error = new Error('All fields are required.');
    error.status = 400;
    throw error;
  }

  return await currentHistoryModels.createCurrentHistory({
    fsc,
    description,
    niin,
    image,
    auth_qty,
    lin,
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
