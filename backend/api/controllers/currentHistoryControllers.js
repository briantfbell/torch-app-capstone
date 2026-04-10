const currentHistoryServices = require('../services/currentHistoryServices');
const archivedHistoryModels = require('../models/archivedHistoryModels');

// --- End item history ---

exports.getCurrentHistory = async (req, res) => {
  try {
    const data = await currentHistoryServices.getCurrentHistory(req.query);
    res.status(200).json({ currentHistory: data });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};

exports.getCurrentHistoryById = async (req, res) => {
  try {
    const currentHistory = await currentHistoryServices.getCurrentHistoryById(req.params.id);
    res.status(200).json({ currentHistory });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};

exports.createCurrentHistory = async (req, res) => {
  try {
    const [existing] = await currentHistoryServices.getCurrentHistory(req.query);

    if (existing) {
      await archivedHistoryModels.createArchivedHistory(existing);
      await currentHistoryServices.deleteCurrentHistory(existing.id);
    }

    const newCurrentHistory = await currentHistoryServices.createCurrentHistory(req.body);

    res.status(201).json({
      newCurrentHistory,
      message: `ID: ${newCurrentHistory.id} has been successfully created.`,
    });
  } catch (err) {
    console.log(err);
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};

exports.updateCurrentHistory = async (req, res) => {
  try {
    const updatedCurrentHistory = await currentHistoryServices.updateCurrentHistory(
      req.params.id,
      req.body,
    );
    res.status(200).json({
      updatedCurrentHistory,
      message: `ID: ${updatedCurrentHistory.id} has been successfully updated.`,
    });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};

exports.deleteCurrentHistory = async (req, res) => {
  try {
    const deletedCurrentHistory = await currentHistoryServices.deleteCurrentHistory(req.params.id);
    res.status(200).json({
      deletedCurrentHistory,
      message: `ID: ${deletedCurrentHistory.id} was successfully deleted.`,
    });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};

// --- Component history ---

exports.getComponentCurrentHistory = async (req, res) => {
  try {
    const data = await currentHistoryServices.getComponentCurrentHistory(req.query);
    res.status(200).json({ currentHistory: data });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};

exports.getComponentCurrentHistoryById = async (req, res) => {
  try {
    const currentHistory = await currentHistoryServices.getComponentCurrentHistoryById(req.params.id);
    res.status(200).json({ currentHistory });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};

exports.createComponentCurrentHistory = async (req, res) => {
  try {
    const [existing] = await currentHistoryServices.getComponentCurrentHistory(req.query);

    if (existing) {
      await archivedHistoryModels.createComponentArchivedHistory(existing);
      await currentHistoryServices.deleteComponentCurrentHistory(existing.id);
    }

    const newCurrentHistory = await currentHistoryServices.createComponentCurrentHistory(req.body);

    res.status(201).json({
      newCurrentHistory,
      message: `ID: ${newCurrentHistory.id} has been successfully created.`,
    });
  } catch (err) {
    console.log(err);
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};

exports.updateComponentCurrentHistory = async (req, res) => {
  try {
    const updatedCurrentHistory = await currentHistoryServices.updateComponentCurrentHistory(
      req.params.id,
      req.body,
    );
    res.status(200).json({
      updatedCurrentHistory,
      message: `ID: ${updatedCurrentHistory.id} has been successfully updated.`,
    });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};

exports.deleteComponentCurrentHistory = async (req, res) => {
  try {
    const deletedCurrentHistory = await currentHistoryServices.deleteComponentCurrentHistory(req.params.id);
    res.status(200).json({
      deletedCurrentHistory,
      message: `ID: ${deletedCurrentHistory.id} was successfully deleted.`,
    });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};
