const archivedHistoryServices = require('../services/archivedHistoryServices');

exports.getAll = async (req, res) => {
  try {
    const data = await archivedHistoryServices.getArchivedHistory(req.query);
    res.status(200).json({ archivedHistory: data });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const archivedHistory = await archivedHistoryServices.getArchivedHistoryById(req.params.id);
    res.status(200).json({ archivedHistory });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};

exports.create = async (req, res) => {
  try {
    const newArchivedHistory = await archivedHistoryServices.createArchivedHistory(req.body);
    res.status(201).json({
      newArchivedHistory,
      message: `ID: ${newArchivedHistory.id} has been successfully created.`,
    });
  } catch (err) {
    console.log(err);
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};
