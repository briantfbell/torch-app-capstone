const currentHistoryEndItemsServices = require('../services/currentHistoryEndItemsServices');
const archivedHistoryEndItemsServices = require('../services/archivedHistoryEndItemsServices');

exports.getAll = async (req, res) => {
  try {
    const currentHistory =
      await currentHistoryEndItemsServices.getCurrentHistory(req.query);
    res.status(200).json({ currentHistory });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const currentHistory =
      await currentHistoryEndItemsServices.getCurrentHistoryById(req.params.id);
    res.status(200).json({ currentHistory });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.create = async (req, res) => {
  try {
    const existing = await currentHistoryEndItemsServices.getCurrentHistoryBySn(
      {
        serial_number: req.body.serial_number,
      },
    );

    if (existing) {
      await archivedHistoryEndItemsServices.createArchivedHistory(existing);
      await currentHistoryEndItemsServices.deleteCurrentHistory(existing.id);
    }

    const newCurrentHistory =
      await currentHistoryEndItemsServices.createCurrentHistory(req.body);

    res.status(201).json({
      newCurrentHistory,
      message: `ID: ${newCurrentHistory.id} has been successfully created.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.update = async (req, res) => {
  try {
    const existing = await currentHistoryEndItemsServices.getCurrentHistoryById(
      req.params.id,
    );

    await archivedHistoryEndItemsServices.createArchivedHistory(existing);

    const updatedCurrentHistory =
      await currentHistoryEndItemsServices.updateCurrentHistory(
        req.params.id,
        req.body,
      );
    res.status(200).json({
      updatedCurrentHistory,
      message: `ID: ${updatedCurrentHistory.id} has been successfully updated.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.del = async (req, res) => {
  try {
    const deletedCurrentHistory =
      await currentHistoryEndItemsServices.deleteCurrentHistory(req.params.id);
    res.status(200).json({
      deletedCurrentHistory,
      message: `ID: ${deletedCurrentHistory.id} was successfully deleted.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};
