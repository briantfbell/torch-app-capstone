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

exports.createComponent = async ({
  niin,
  description,
  ui,
  auth_qty,
  image,
  arc,
  end_item_lin,
}) => {
  if (
    !niin ||
    !description ||
    !ui ||
    !auth_qty ||
    !image ||
    !arc ||
    !end_item_lin
  ) {
    const error = new Error('All fields are required.');
    error.status = 400;
    throw error;
  }

  // const normalizedLin = end_item_lin.trim().toLowerCase();

  return await componentsModels.createComponent(
    {
      niin,
      description,
      ui,
      auth_qty,
      image,
      arc,
    },
    end_item_lin,
  );
};

exports.updateComponent = async (id, componentData) => {
  const existingComponent = await componentsModels.getComponentById(id);

  if (!existingComponent) {
    const error = new Error('Component does not exist.');
    error.status = 404;
    throw error;
  }

  const hasChanges = Object.keys(componentData).some(
    key => existingComponent[key] !== componentData[key],
  );

  if (!hasChanges) {
    const error = new Error('No changes detected.');
    error.status = 400;
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
