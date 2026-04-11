const componentsServices = require('../services/componentsServices');

exports.getAllComponents = async (req, res) => {
  try {
    const { query } = req;
    const allComponents = await componentsServices.getAllComponents(query);

    res.status(200).json({ allComponents });
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

    res.status(200).json({ component });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.getComponentsByUicId = async (req, res) => {
  try {
    const { uic_id } = req.params;
    const components = await componentsServices.getComponentsByUicId(uic_id);

    res.status(200).json({ components });
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
      newComponent,
      message: `NIIN: ${newComponent.niin} has been successfully created.`,
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
      updatedComponent,
      message: `NIIN: ${updatedComponent.niin} has been successfully updated.`,
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
      deletedComponent,
      message: `NIIN: ${deletedComponent.niin} was successfully deleted.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};
