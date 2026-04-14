const serialEndItemsServices = require('../services/serialEndItemsServices');

exports.getAllSerialEndItems = async (req, res) => {
  try {
    const { query } = req;
    const allSerialEndItems =
      await serialEndItemsServices.getAllSerialEndItems(query);

    res.status(200).json({ allSerialEndItems });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.getSerialEndItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const serialEndItem = await serialEndItemsServices.getSerialEndItemById(id);

    res.status(200).json({ serialEndItem });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.getSerialEndItemsByUicId = async (req, res) => {
  try {
    const { uic_id } = req.params;
    const serialEndItems =
      await serialEndItemsServices.getSerialEndItemsByUicId(uic_id);

    res.status(200).json({ serialEndItems });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.createSerialEndItem = async (req, res) => {
  try {
    const newSerialEndItem = await serialEndItemsServices.createSerialEndItem(
      req.body,
    );

    res.status(201).json({
      newSerialEndItem,
      message: `SN: ${newSerialEndItem.serial_number} has been successfully posted.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.updateSerialEndItem = async (req, res) => {
  try {
    const updatedSerialEndItem =
      await serialEndItemsServices.updateSerialEndItem(req.params.id, req.body);

    res.status(200).json({
      updatedSerialEndItem,
      message: `SN: ${updatedSerialEndItem.serial_number} has been successfully updated.`,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Internal server error.',
    });
  }
};

exports.deleteSerialEndItem = async (req, res) => {
  try {
    const deletedSerialEndItem =
      await serialEndItemsServices.deleteSerialEndItem(req.params.id);

    res.status(200).json({
      deletedSerialEndItem,
      message: `SN: ${deletedSerialEndItem.serial_number} was successfully deleted.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};
