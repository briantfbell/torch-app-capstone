const ingestServices = require('../services/ingestServices');

exports.ingest = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  if (req.user.role.toLowerCase() !== 'hrc') {
    return res.status(403).json({ message: 'Only HRCs can upload files.' });
  }

  try {
    await ingestServices.ingest(req.file, req.user);

    res.status(201).json({ message: 'Success.' });
  } catch (err) {
    res
      .status(err.status || 500)
      .send('Error parsing Excel file: ' + err.message);
  }
};
