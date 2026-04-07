const rawServices = require('../services/rawServices');

exports.createRaw = async (req, res) => {
  try {
    const newRaw = await rawServices.createRaw(req.body);

    res.status(201).json({
      newRaw: newRaw,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};
