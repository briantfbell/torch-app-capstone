const archivedHistoryComponentsModels = require('../models/archivedHistoryComponentsModels');

exports.getComponentArchivedHistory = async query => {
  return await archivedHistoryComponentsModels.getComponentArchivedHistory(
    query,
  );
};

exports.getComponentArchivedHistoryById = async id => {
  const record =
    await archivedHistoryComponentsModels.getComponentArchivedHistoryById(id);

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
  if (!component_id || !user_id || seen == null || !location || !last_seen) {
    const error = new Error('All fields are required.');
    error.status = 400;
    throw error;
  }

  return await archivedHistoryComponentsModels.createComponentArchivedHistory({
    component_id,
    user_id,
    seen,
    location,
    last_seen,
    serial_number,
  });
};

exports.deleteComponentArchivedHistory = async id => {
  const existing =
    await archivedHistoryComponentsModels.getComponentArchivedHistoryById(id);

  if (!existing) {
    const error = new Error('This archived history id does not exist.');
    error.status = 404;
    throw error;
  }

  const [deleted] =
    await archivedHistoryComponentsModels.deleteComponentArchivedHistory(id);
  return deleted;
};
