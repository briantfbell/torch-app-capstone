const currentHistoryComponentsServices = require('../services/currentHistoryComponentsServices');
const archivedHistoryComponentsServices = require('../services/archivedHistoryComponentsServices');

exports.getAll = async (req, res) => {
  try {
    const currentHistory =
      await currentHistoryComponentsServices.getComponentCurrentHistory(
        req.query,
      );
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
      await currentHistoryComponentsServices.getComponentCurrentHistoryById(
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
    let existing;

    if (req.body.serial_number) {
      existing =
        await currentHistoryComponentsServices.getComponentCurrentHistoryBySn(
          req.body.serial_number,
        );
    } else {
      existing =
        await currentHistoryComponentsServices.getUnserializedComponentCurrentHistory(
          req.body.component_id,
        );
    }

    if (existing) {
      await archivedHistoryComponentsServices.createComponentArchivedHistory(
        existing,
      );
      await currentHistoryComponentsServices.deleteComponentCurrentHistory(
        existing.id,
      );
    }

    const newCurrentHistory =
      await currentHistoryComponentsServices.createComponentCurrentHistory(
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
    const existing =
      await currentHistoryComponentsServices.getComponentCurrentHistoryById(
        req.params.id,
      );

    await archivedHistoryComponentsServices.createComponentArchivedHistory(
      existing,
    );

    const updatedCurrentHistory =
      await currentHistoryComponentsServices.updateComponentCurrentHistory(
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
      await currentHistoryComponentsServices.deleteComponentCurrentHistory(
        req.params.id,
      );
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
