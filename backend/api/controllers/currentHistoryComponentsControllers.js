const currentHistoryServices = require('../services/currentHistoryServices');
const archivedHistoryServices = require('../services/archivedHistoryServices');

exports.getAll = async (req, res) => {
  try {
    const data = await currentHistoryServices.getComponentCurrentHistory(req.query);
    res.status(200).json({ currentHistory: data });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const currentHistory = await currentHistoryServices.getComponentCurrentHistoryById(req.params.id);
    res.status(200).json({ currentHistory });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};

exports.create = async (req, res) => {
  try {
    let existing;

    if (req.body.serial_number) {
      existing = await currentHistoryServices.getComponentCurrentHistoryBySn(req.body.serial_number);
    } else {
      const [record] = await currentHistoryServices.getComponentCurrentHistory({
        component_id: req.body.component_id,
      });
      existing = record;
    }

    if (existing) {
      await archivedHistoryServices.createComponentArchivedHistory(existing);
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

exports.update = async (req, res) => {
  try {
    const existing = await currentHistoryServices.getComponentCurrentHistoryById(req.params.id);

    await archivedHistoryServices.createComponentArchivedHistory(existing);

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

exports.del = async (req, res) => {
  try {
    const deletedCurrentHistory = await currentHistoryServices.deleteComponentCurrentHistory(
      req.params.id,
    );
    res.status(200).json({
      deletedCurrentHistory,
      message: `ID: ${deletedCurrentHistory.id} was successfully deleted.`,
    });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};
