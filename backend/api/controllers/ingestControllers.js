const ingestServices = require('../services/ingestServices');

exports.ingestComponents = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    await ingestServices.ingestComponents(req.file, req.user);

    res.status(201).json({ message: 'Upload successful.' });
  } catch (err) {
    console.log(err);
    res
      .status(err.status || 500)
      .send('Error parsing Excel file: ' + err.message);
  }
};

exports.ingestEndItems = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    await ingestServices.ingestEndItems(req.file, req.user);

    res.status(201).json({ message: 'Upload successful.' });
  } catch (err) {
    res
      .status(err.status || 500)
      .send('Error parsing Excel file: ' + err.message);
  }
};
