const archivedHistoryModels = require('../models/archivedHistoryModels');

// --- End item history ---

exports.getArchivedHistory = async query => {
  return await archivedHistoryModels.getArchivedHistory(query);
};

exports.getArchivedHistoryById = async id => {
  const record = await archivedHistoryModels.getArchivedHistoryById(id);

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
  if (!end_item_id || !user_id || !seen || !location || !last_seen || !serial_number) {
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
    serial_number,
  });
};

exports.deleteArchivedHistory = async id => {
  const existing = await archivedHistoryModels.getArchivedHistoryById(id);

  if (!existing) {
    const error = new Error('This archived history id does not exist.');
    error.status = 404;
    throw error;
  }

  const [deleted] = await archivedHistoryModels.deleteArchivedHistory(id);
  return deleted;
};

// --- Component history ---

exports.getComponentArchivedHistory = async query => {
  return await archivedHistoryModels.getComponentArchivedHistory(query);
};

exports.getComponentArchivedHistoryById = async id => {
  const record = await archivedHistoryModels.getComponentArchivedHistoryById(id);

  if (!record) {
    const error = new Error('This archived history id does not exist.');
    error.status = 404;
    throw error;
  }

  return record;
};

exports.createComponentArchivedHistory = async ({
  component_id,
  user_id,
  seen,
  location,
  last_seen,
  serial_number,
}) => {
  if (!component_id || !user_id || !seen || !location || !last_seen) {
    const error = new Error('All fields are required.');
    error.status = 400;
    throw error;
  }

  return await archivedHistoryModels.createComponentArchivedHistory({
    component_id,
    user_id,
    seen,
    location,
    last_seen,
    serial_number,
  });
};

exports.deleteComponentArchivedHistory = async id => {
  const existing = await archivedHistoryModels.getComponentArchivedHistoryById(id);

  if (!existing) {
    const error = new Error('This archived history id does not exist.');
    error.status = 404;
    throw error;
  }

  const [deleted] = await archivedHistoryModels.deleteComponentArchivedHistory(id);
  return deleted;
};
