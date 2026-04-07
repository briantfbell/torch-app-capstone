const serialItemsServices = require('../services/serialItemsServices');

exports.getAllSerialItems = async (req, res) => {
  try {
    const { query } = req;
    const data = await serialItemsServices.getAllSerialItems(query);

    res.status(200).json({ allSerialItems: data });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.getSerialItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const serialItem = await serialItemsServices.getSerialItemById(id);

    res.status(200).json({ serialItem: serialItem });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.createSerialItem = async (req, res) => {
  try {
    const newSerialItem = await serialItemsServices.createSerialItem(req.body);

    res.status(201).json({
      newSerialItem: newSerialItem,
      message: `SN: ${newSerialItem.serial_number} has been successfully posted.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.updateSerialItem = async (req, res) => {
  try {
    const updatedSerialItem = await serialItemsServices.updateSerialItem(
      req.params.id,
      req.body,
    );

    res.status(200).json({
      updatedSerialItem: updatedSerialItem,
      message: `SN: ${updatedSerialItem.serial_number} has been successfully updated.`,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Internal server error.',
    });
  }
};

exports.deleteSerialItem = async (req, res) => {
  try {
    const deletedSerialItem = await serialItemsServices.deleteSerialItem(
      req.params.id,
    );

    res.status(200).json({
      deletedSerialItem: deletedSerialItem,
      message: `SN: ${deletedSerialItem.serial_number} was successfully deleted.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};
