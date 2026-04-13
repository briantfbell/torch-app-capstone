const ingestServices = require('../services/ingestServices');
const { schema } = require('../helpers/ingestSchema');

exports.getIngestSchema = (_req, res) => {
  const columns = Object.values(schema).map(({ column }) => column);
  res.json({ columns });
};

exports.ingestComponents = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    await ingestServices.ingestComponents(req.file, req.user);

    res.status(201).json({ message: 'Upload successful.' });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
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
      .json({ message: err.message || 'Internal server error.' });
  }
};
