const currentHistoryServices = require('../services/currentHistoryServices');
const archivedHistoryServices = require('../services/archivedHistoryServices');

exports.getAll = async (req, res) => {
  try {
    const data = await currentHistoryServices.getCurrentHistory(req.query);
    res.status(200).json({ currentHistory: data });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const currentHistory = await currentHistoryServices.getCurrentHistoryById(
      req.params.id,
    );
    res.status(200).json({ currentHistory });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.create = async (req, res) => {
  try {
    const existing = await currentHistoryServices.getCurrentHistoryBySn({
      serial_number: req.body.serial_number,
    });

    if (existing) {
      await archivedHistoryServices.createArchivedHistory(existing);
      await currentHistoryServices.deleteCurrentHistory(existing.id);
    }

    const newCurrentHistory = await currentHistoryServices.createCurrentHistory(
      req.body,
    );

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
    const existing = await currentHistoryServices.getCurrentHistoryById(
      req.params.id,
    );

    await archivedHistoryServices.createArchivedHistory(existing);

    const updatedCurrentHistory =
      await currentHistoryServices.updateCurrentHistory(
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
      await currentHistoryServices.deleteCurrentHistory(req.params.id);
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
