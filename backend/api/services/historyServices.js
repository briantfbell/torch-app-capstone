const historyModels = require('../models/historyModels');

exports.getAllHistory = async query => {
  return await historyModels.getAllHistory(query);
};

exports.getHistoryById = async id => {
  const history = await historyModels.getHistoryById(id);

  if (!history) {
    const error = new Error('History does not exist.');
    error.status = 404;
    throw error;
  }

  return history;
};

exports.createHistory = async ({
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

  return await historyModels.createHistory({
    fsc,
    description,
    niin,
    image,
    auth_qty,
    lin,
  });
};

exports.updateHistory = async (id, historyData) => {
  const existingHistory = await historyModels.getHistoryById(id);

  if (!existingHistory) {
    const error = new Error('History does not exist.');
    error.status = 404;
    throw error;
  }

  return await historyModels.updateHistory(id, historyData);
};

exports.deleteHistory = async id => {
  const existingHistory = await historyModels.getHistoryById(id);

  if (!existingHistory) {
    const error = new Error('History does not exist.');
    error.status = 404;
    throw error;
  }

  const [deletedHistory] = await historyModels.deleteHistory(id);
  return deletedHistory;
};
