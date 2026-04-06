const componentsModels = require('../models/componentsModels');

exports.getAllComponents = async query => {
  return await componentsModels.getAllComponents(query);
};

exports.getComponentById = async id => {
  const component = await componentsModels.getComponentById(id);

  if (!component) {
    const error = new Error('Component does not exist.');
    error.status = 404;
    throw error;
  }

  return component;
};

exports.createComponent = async ({ description, nsn, end_qty, has_qty, image, end_id }) => {
  if (!description || !nsn || !end_id) {
    const error = new Error('description, nsn, and end_id are required.');
    error.status = 400;
    throw error;
  }

  return await componentsModels.createComponent({ description, nsn, end_qty, has_qty, image, end_id });
};

exports.updateComponent = async (id, componentData) => {
  const existingComponent = await componentsModels.getComponentById(id);

  if (!existingComponent) {
    const error = new Error('Component does not exist.');
    error.status = 404;
    throw error;
  }

  return await componentsModels.updateComponent(id, componentData);
};

exports.deleteComponent = async id => {
  const existingComponent = await componentsModels.getComponentById(id);

  if (!existingComponent) {
    const error = new Error('Component does not exist.');
    error.status = 404;
    throw error;
  }

  const [deletedComponent] = await componentsModels.deleteComponent(id);
  return deletedComponent;
};
