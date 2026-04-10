const archivedHistoryServices = require('../services/archivedHistoryServices');

exports.getArchivedHistory = async (req, res) => {
  try {
    const { query } = req;
    const data = await archivedHistoryServices.getArchivedHistory(query);

    res.status(200).json({ archivedHistory: data });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.getArchivedHistoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const archivedHistory =
      await archivedHistoryServices.getArchivedHistoryById(id);

    res.status(200).json({ archivedHistory: archivedHistory });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.createArchivedHistory = async (req, res) => {
  try {
    const { query } = req;
    const [data] = await archivedHistoryServices.getArchivedHistory(query);
    console.log(data);

    if (data) {
      await archivedHistoryModels.createArchivedHistory(data);
      await archivedHistoryServices.deleteArchivedHistory(data.id);
    }

    const newArchivedHistory =
      await archivedHistoryServices.createArchivedHistory(req.body);

    res.status(201).json({
      newArchivedHistory: newArchivedHistory,
      message: `ID: ${newArchivedHistory.id} has been successfully created.`,
    });
  } catch (err) {
    console.log(err);
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.updateArchivedHistory = async (req, res) => {
  try {
    const updatedArchivedHistory =
      await archivedHistoryServices.updateArchivedHistory(
        req.params.id,
        req.body,
      );

    res.status(200).json({
      updatedArchivedHistory: updatedArchivedHistory,
      message: `ID: ${updatedArchivedHistory.id} has been successfully updated.`,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Internal server error.',
    });
  }
};

exports.deleteArchivedHistory = async (req, res) => {
  try {
    const deletedArchivedHistory =
      await archivedHistoryServices.deleteArchivedHistory(req.params.id);

    res.status(200).json({
      deletedArchivedHistory: deletedArchivedHistory,
      message: `ID: ${deletedArchivedHistory.id} was successfully deleted.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};
