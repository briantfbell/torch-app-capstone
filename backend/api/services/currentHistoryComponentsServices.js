const currentHistoryComponentsModels = require('../models/currentHistoryComponentsModels');
const serialComponentsModels = require('../models/serialComponentsModels');

exports.getComponentCurrentHistory = async query => {
  return await currentHistoryComponentsModels.getComponentCurrentHistory(query);
};

exports.getComponentCurrentHistoryBySn = async serial_number => {
  return await currentHistoryComponentsModels.getComponentCurrentHistoryBySn(
    serial_number,
  );
};

exports.getUnserializedComponentCurrentHistory = async component_id => {
  return await currentHistoryComponentsModels.getUnserializedComponentCurrentHistory(
    component_id,
  );
};

exports.getComponentCurrentHistoryById = async id => {
  const record =
    await currentHistoryComponentsModels.getComponentCurrentHistoryById(id);

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
  if (!component_id || !user_id || seen == null || !location || !last_seen) {
    const error = new Error('All fields are required.');
    error.status = 400;
    throw error;
  }

  let resolved_serial_number;
  if (serial_number) {
    const serial_component_item =
      await serialComponentsModels.getSerialComponentItemBySn(serial_number);
    if (!serial_component_item) {
      const error = new Error(`Serial number ${serial_number} not found.`);
      error.status = 404;
      throw error;
    }
    resolved_serial_number = serial_component_item.id;
  }

  return await currentHistoryComponentsModels.createComponentCurrentHistory({
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
    await currentHistoryComponentsModels.getComponentCurrentHistoryById(id);

  if (!existing) {
    const error = new Error('This current history id does not exist.');
    error.status = 404;
    throw error;
  }

  if (currentHistoryData.serial_number) {
    const conflict =
      await currentHistoryComponentsModels.getComponentCurrentHistoryBySn(
        currentHistoryData.serial_number,
      );
    if (conflict && conflict.id !== id) {
      const error = new Error(
        `Serial number ${currentHistoryData.serial_number} already has a current history record.`,
      );
      error.status = 409;
      throw error;
    }
  }

  return await currentHistoryComponentsModels.updateComponentCurrentHistory(
    id,
    currentHistoryData,
  );
};

exports.deleteComponentCurrentHistory = async id => {
  const existing =
    await currentHistoryComponentsModels.getComponentCurrentHistoryById(id);

  if (!existing) {
    const error = new Error('This current history id does not exist.');
    error.status = 404;
    throw error;
  }

  const [deleted] =
    await currentHistoryComponentsModels.deleteComponentCurrentHistory(id);
  return deleted;
};
