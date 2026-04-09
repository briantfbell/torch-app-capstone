const rawServices = require('../services/rawServices');

exports.createRaw = async (req, res) => {
  try {
    await rawServices.createRaw(req);

    res.status(201).json({ message: 'Successfully uploaded.' });
  } catch (err) {
    res
      .status(err.status || 500)
      .send('Error parsing Excel file: ' + err.message);
  }
};
