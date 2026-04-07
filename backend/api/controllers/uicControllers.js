const uicServices = require('../services/uicServices');

exports.getAllUics = async (req, res) => {
  try {
    const { query } = req;
    const data = await uicServices.getAllUics(query);

    res.status(200).json(data);
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.getUicById = async (req, res) => {
  try {
    const { id } = req.params;
    const uic = await uicServices.getUicById(id);

    res.status(200).json(uic);
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.createUic = async (req, res) => {
  try {
    const newUic = await uicServices.createUic(req.body);

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
    const updatedUic = await uicServices.updateUic(req.params.id, req.body);

    res.status(200).json({
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
    const deletedUic = await uicServices.deleteUic(req.params.id);

    res.status(200).json({
      message: `UIC '${deletedUic.uic}' was successfully deleted.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};
