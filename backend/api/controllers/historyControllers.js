const historyServices = require('../services/historyServices');

exports.getAllHistory = async (req, res) => {
  try {
    const { query } = req;
    const data = await historyServices.getAllHistory(query);

    res.status(200).json({ allHistory: data });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.getHistoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const endItem = await historyServices.getHistoryById(id);

    res.status(200).json({ endItem: endItem });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.createHistory = async (req, res) => {
  try {
    const newHistory = await historyServices.createHistory(req.body);

    res.status(201).json({
      newHistory: newHistory,
      message: `ID: ${newHistory.id} has been successfully created.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.updateHistory = async (req, res) => {
  try {
    const updatedHistory = await historyServices.updateHistory(
      req.params.id,
      req.body,
    );

    res.status(200).json({
      updatedHistory: updatedHistory,
      message: `ID: ${updatedHistory.id} has been successfully updated.`,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Internal server error.',
    });
  }
};

exports.deleteHistory = async (req, res) => {
  try {
    const deletedHistory = await historyServices.deleteHistory(req.params.id);

    res.status(200).json({
      deletedHistory: deletedHistory,
      message: `ID: ${deletedHistory.id} was successfully deleted.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};
