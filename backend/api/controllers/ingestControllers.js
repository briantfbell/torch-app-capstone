const ingestServices = require('../services/ingestServices');

exports.ingest = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

<<<<<<< HEAD
  if (req.user.role.toLowerCase() !== 'hrc') {
=======
  if (req.user.role !== 'hrc') {
>>>>>>> ced7a272030c98e8072dc65ff6c9215310b33896
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
