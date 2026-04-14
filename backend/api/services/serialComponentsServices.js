const serialComponentsModel = require('../models/serialComponentsModels');

exports.getAllSerialComponents = async query => {
  return await serialComponentsModel.getAllSerialComponents(query);
};

exports.getSerialComponentById = async id => {
  const serialComponent =
    await serialComponentsModel.getSerialComponentById(id);

  if (!serialComponent) {
    const error = new Error('Serial item not found.');
    error.status = 404;
    throw error;
  }

  return serialComponent;
};

exports.getSerialComponentsByUicId = async uic_id => {
  const serialComponents =
    await serialComponentsModel.getSerialComponentsByUicId(uic_id);

  if (!serialComponents) {
    const error = new Error(
      'Either the UIC does not exist or no serial component items recorded.',
    );
    error.status = 404;
    throw error;
  }

  return serialComponents;
};

exports.createSerialComponent = async serialComponentData => {
  const { component_id, user_id, serial_number, status } = serialComponentData;

  if (!serial_number || !user_id || !status || !component_id) {
    const error = new Error('All fields are required.');
    error.status = 400;
    throw error;
  }

  return await serialComponentsModel.createSerialComponent(
    { serial_number, status },
    component_id,
    user_id,
  );
};

exports.updateSerialComponent = async (id, serialComponentData) => {
  const existingSerialComponent =
    await serialComponentsModel.getSerialComponentById(id);

  if (!existingSerialComponent) {
    const error = new Error('Serial component item does not exist.');
    error.status = 404;
    throw error;
  }

  return await serialComponentsModel.updateSerialComponent(
    id,
    serialComponentData,
  );
};

exports.deleteSerialComponent = async id => {
  const existingSerialComponent =
    await serialComponentsModel.getSerialComponentById(id);

  if (!existingSerialComponent) {
    const error = new Error('Serial component item does not exist.');
    error.status = 404;
    throw error;
  }

  const [deletedSerialComponent] =
    await serialComponentsModel.deleteSerialComponent(id);

  return deletedSerialComponent;
};
