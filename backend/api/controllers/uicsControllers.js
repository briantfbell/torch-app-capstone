const uicsServices = require('../services/uicsServices');

exports.getAllUics = async (req, res) => {
  try {
    const { query } = req;
    const allUics = await uicsServices.getAllUics(query);

    res.status(200).json({ allUics });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.getUicById = async (req, res) => {
  try {
    const { id } = req.params;
    const uic = await uicsServices.getUicById(id);

    res.status(200).json({ uic });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.createUic = async (req, res) => {
  try {
    const newUic = await uicsServices.createUic(req.body);

    res.status(201).json({
      newUic,
      message: `UIC '${newUic.uic}' has been successfully created.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.updateUic = async (req, res) => {
  try {
    const updatedUic = await uicsServices.updateUic(req.params.id, req.body);

    res.status(200).json({
      updatedUic,
      message: `UIC '${updatedUic.uic}' has been successfully updated.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.deleteUic = async (req, res) => {
  try {
    const deletedUic = await uicsServices.deleteUic(req.params.id);

    res.status(200).json({
      deletedUic,
      message: `UIC '${deletedUic.uic}' was successfully deleted.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};
