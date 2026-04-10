const currentHistoryModels = require('../models/currentHistoryModels');

// --- End item history ---

exports.getCurrentHistory = async query => {
  return await currentHistoryModels.getCurrentHistory(query);
};

exports.getCurrentHistoryById = async id => {
  const record = await currentHistoryModels.getCurrentHistoryById(id);

  if (!record) {
    const error = new Error('This current history id does not exist.');
    error.status = 404;
    throw error;
  }

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
  if (!end_item_id || !user_id || !seen || !location || !last_seen || !serial_number) {
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
    serial_number,
  });
};

exports.updateCurrentHistory = async (id, currentHistoryData) => {
  const existing = await currentHistoryModels.getCurrentHistoryById(id);

  if (!existing) {
    const error = new Error('This current history id does not exist.');
    error.status = 404;
    throw error;
  }

  return await currentHistoryModels.updateCurrentHistory(id, currentHistoryData);
};

exports.deleteCurrentHistory = async id => {
  const existing = await currentHistoryModels.getCurrentHistoryById(id);

  if (!existing) {
    const error = new Error('This current history id does not exist.');
    error.status = 404;
    throw error;
  }

  const [deleted] = await currentHistoryModels.deleteCurrentHistory(id);
  return deleted;
};

// --- Component history ---

exports.getComponentCurrentHistory = async query => {
  return await currentHistoryModels.getComponentCurrentHistory(query);
};

exports.getComponentCurrentHistoryById = async id => {
  const record = await currentHistoryModels.getComponentCurrentHistoryById(id);

  if (!record) {
    const error = new Error('This current history id does not exist.');
    error.status = 404;
    throw error;
  }

  return record;
};

exports.createComponentCurrentHistory = async ({
  component_id,
  user_id,
  seen,
  location,
  last_seen,
  serial_number,
}) => {
  if (!component_id || !user_id || !seen || !location || !last_seen || !serial_number) {
    const error = new Error('All fields are required.');
    error.status = 400;
    throw error;
  }

  return await currentHistoryModels.createComponentCurrentHistory({
    component_id,
    user_id,
    seen,
    location,
    last_seen,
    serial_number,
  });
};

exports.updateComponentCurrentHistory = async (id, currentHistoryData) => {
  const existing = await currentHistoryModels.getComponentCurrentHistoryById(id);

  if (!existing) {
    const error = new Error('This current history id does not exist.');
    error.status = 404;
    throw error;
  }

  return await currentHistoryModels.updateComponentCurrentHistory(id, currentHistoryData);
};

exports.deleteComponentCurrentHistory = async id => {
  const existing = await currentHistoryModels.getComponentCurrentHistoryById(id);

  if (!existing) {
    const error = new Error('This current history id does not exist.');
    error.status = 404;
    throw error;
  }

  const [deleted] = await currentHistoryModels.deleteComponentCurrentHistory(id);
  return deleted;
};
