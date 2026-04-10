const currentHistoryModels = require('../models/currentHistoryModels');
const serialItemsModels = require('../models/serialItemsModels');

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

exports.getCurrentHistoryBySn = async sn => {
  const record = await currentHistoryModels.getCurrentHistoryBySn(sn);

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
    !seen ||
    !location ||
    !last_seen ||
    !serial_number
  ) {
    const error = new Error('All fields are required.');
    error.status = 400;
    throw error;
  }

  const serial_end_item =
    await serialItemsModels.getSerialItemBySn(serial_number);

  return await currentHistoryModels.createCurrentHistory({
    end_item_id,
    user_id,
    seen,
    location,
    last_seen,
    serial_number: serial_end_item.id,
  });
};

exports.updateCurrentHistory = async (id, currentHistoryData) => {
  const existing = await currentHistoryModels.getCurrentHistoryById(id);

  if (!existing) {
    const error = new Error('This current history id does not exist.');
    error.status = 404;
    throw error;
  }

  return await currentHistoryModels.updateCurrentHistory(
    id,
    currentHistoryData,
  );
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

exports.getComponentCurrentHistoryBySn = async serial_number => {
  return await currentHistoryModels.getComponentCurrentHistoryBySn(serial_number);
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
  if (!component_id || !user_id || !seen || !location || !last_seen) {
    const error = new Error('All fields are required.');
    error.status = 400;
    throw error;
  }

  let resolved_serial_number;
  if (serial_number) {
    const serial_component_item = await serialItemsModels.getSerialComponentItemBySn(serial_number);
    resolved_serial_number = serial_component_item.id;
  }

  return await currentHistoryModels.createComponentCurrentHistory({
    component_id,
    user_id,
    seen,
    location,
    last_seen,
    serial_number: resolved_serial_number,
  });
};

exports.updateComponentCurrentHistory = async (id, currentHistoryData) => {
  const existing =
    await currentHistoryModels.getComponentCurrentHistoryById(id);

  if (!existing) {
    const error = new Error('This current history id does not exist.');
    error.status = 404;
    throw error;
  }

  return await currentHistoryModels.updateComponentCurrentHistory(
    id,
    currentHistoryData,
  );
};

exports.deleteComponentCurrentHistory = async id => {
  const existing =
    await currentHistoryModels.getComponentCurrentHistoryById(id);

  if (!existing) {
    const error = new Error('This current history id does not exist.');
    error.status = 404;
    throw error;
  }

  const [deleted] =
    await currentHistoryModels.deleteComponentCurrentHistory(id);
  return deleted;
};
