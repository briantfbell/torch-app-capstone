const componentsServices = require('../services/componentsServices');

exports.getAllComponents = async (req, res) => {
  try {
    const { query } = req;
    const data = await componentsServices.getAllComponents(query);

    res.status(200).json(data);
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

    res.status(200).json(component);
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
      message: `'${newComponent.description}' has been successfully created.`,
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
      message: `'${updatedComponent.description}' has been successfully updated.`,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Internal server error.',
    });
  }
};

exports.deleteComponent = async (req, res) => {
  try {
    const deletedComponent = await componentsServices.deleteComponent(req.params.id);

    res
      .status(200)
      .json({ message: `'${deletedComponent.description}' was successfully deleted.` });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};
