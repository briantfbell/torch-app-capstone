const serialComponentsServices = require('../services/serialComponentsServices');

exports.getAllSerialComponents = async (req, res) => {
  try {
    const { query } = req;
    const allSerialComponents =
      await serialComponentsServices.getAllSerialComponents(query);

    res.status(200).json({ allSerialComponents });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.getSerialComponentById = async (req, res) => {
  try {
    const { id } = req.params;
    const serialComponent =
      await serialComponentsServices.getSerialComponentById(id);

    res.status(200).json({ serialComponent });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.getSerialComponentsByUicId = async (req, res) => {
  try {
    const { uic_id } = req.params;
    const serialComponents =
      await serialComponentsServices.getSerialComponentsByUicId(uic_id);

    res.status(200).json({ serialComponents });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.createSerialComponent = async (req, res) => {
  try {
    const newSerialComponent =
      await serialComponentsServices.createSerialComponent(req.body);

    res.status(201).json({
      newSerialComponent,
      message: `SN: ${newSerialComponent.serial_number} has been successfully posted.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.updateSerialComponent = async (req, res) => {
  try {
    const updatedSerialComponent =
      await serialComponentsServices.updateSerialComponent(
        req.params.id,
        req.body,
      );

    res.status(200).json({
      updatedSerialComponent,
      message: `SN: ${updatedSerialComponent.serial_number} has been successfully updated.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.deleteSerialComponent = async (req, res) => {
  try {
    const deletedSerialComponent =
      await serialComponentsServices.deleteSerialComponent(req.params.id);

    res.status(200).json({
      deletedSerialComponent,
      message: `SN: ${deletedSerialComponent.serial_number} was successfully deleted.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};
