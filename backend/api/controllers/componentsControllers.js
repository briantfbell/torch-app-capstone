const componentsServices = require('../services/componentsServices');

exports.getAllComponents = async (req, res) => {
  try {
    const { query } = req;
    const data = await componentsServices.getAllComponents(query);

    res.status(200).json({ allComponents: data });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.getComponentById = async (req, res) => {
  try {
    const { id } = req.params;
    const component = await componentsServices.getComponentById(id);

    res.status(200).json({ component: component });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.createComponent = async (req, res) => {
  try {
    const newComponent = await componentsServices.createComponent(req.body);

    res.status(201).json({
      newComponent: newComponent,
      message: `LIN: ${newComponent.lin} has been successfully created.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.updateComponent = async (req, res) => {
  try {
    const updatedComponent = await componentsServices.updateComponent(
      req.params.id,
      req.body,
    );

    res.status(200).json({
      updatedComponent: updatedComponent,
      message: `LIN: ${updatedComponent.lin} has been successfully updated.`,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Internal server error.',
    });
  }
};

exports.deleteComponent = async (req, res) => {
  try {
    const deletedComponent = await componentsServices.deleteComponent(
      req.params.id,
    );

    res.status(200).json({
      deletedComponent: deletedComponent,
      message: `LIN: ${deletedComponent.lin} was successfully deleted.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};
