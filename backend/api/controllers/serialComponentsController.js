const serialComponentsServices = require('../services/serialComponentsServices');

exports.getAllSerialComponentItems = async (req, res) => {
  try {
    const { query } = req;
    const allSerialComponentItems =
      await serialComponentsServices.getAllSerialComponentItems(query);

    res.status(200).json({ allSerialComponentItems });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.getSerialComponentItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const serialComponentItem =
      await serialComponentsServices.getSerialComponentItemById(id);

    res.status(200).json({ serialComponentItem });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.getSerialComponentItemsByUicId = async (req, res) => {
  try {
    const { uic_id } = req.params;
    const serialComponentItems =
      await serialComponentsServices.getSerialComponentItemsByUicId(uic_id);

    res.status(200).json({ serialComponentItems });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.createSerialComponentItem = async (req, res) => {
  try {
    const newSerialComponentItem =
      await serialComponentsServices.createSerialComponentItem(req.body);

    res.status(201).json({
      newSerialComponentItem,
      message: `SN: ${newSerialComponentItem.serial_number} has been successfully posted.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.updateSerialComponentItem = async (req, res) => {
  try {
    const updatedSerialComponentItem =
      await serialComponentsServices.updateSerialComponentItem(
        req.params.id,
        req.body,
      );

    res.status(200).json({
      updatedSerialComponentItem,
      message: `SN: ${updatedSerialComponentItem.serial_number} has been successfully updated.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.deleteSerialComponentItem = async (req, res) => {
  try {
    const deletedSerialComponentItem =
      await serialComponentsServices.deleteSerialComponentItem(req.params.id);

    res.status(200).json({
      deletedSerialComponentItem,
      message: `SN: ${deletedSerialComponentItem.serial_number} was successfully deleted.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};
