const currentHistoryServices = require('../services/currentHistoryServices');

exports.getAllCurrentHistory = async (req, res) => {
  try {
    const { query } = req;
    const data = await currentHistoryServices.getAllCurrentHistory(query);

    res.status(200).json({ allCurrentHistory: data });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.getCurrentHistoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const endItem = await currentHistoryServices.getCurrentHistoryById(id);

    res.status(200).json({ endItem: endItem });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.createCurrentHistory = async (req, res) => {
  try {
    const newCurrentHistory = await currentHistoryServices.createCurrentHistory(
      req.body,
    );

    res.status(201).json({
      newCurrentHistory: newCurrentHistory,
      message: `ID: ${newCurrentHistory.id} has been successfully created.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.updateCurrentHistory = async (req, res) => {
  try {
    const updatedCurrentHistory =
      await currentHistoryServices.updateCurrentHistory(
        req.params.id,
        req.body,
      );

    res.status(200).json({
      updatedCurrentHistory: updatedCurrentHistory,
      message: `ID: ${updatedCurrentHistory.id} has been successfully updated.`,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Internal server error.',
    });
  }
};

exports.deleteCurrentHistory = async (req, res) => {
  try {
    const deletedCurrentHistory =
      await currentHistoryServices.deleteCurrentHistory(req.params.id);

    res.status(200).json({
      deletedCurrentHistory: deletedCurrentHistory,
      message: `ID: ${deletedCurrentHistory.id} was successfully deleted.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};
