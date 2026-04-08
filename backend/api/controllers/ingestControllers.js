const postIngestItem = require('../services/ingestServices');
const multer  = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

exports.postIngestItem = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    };

    // postIngestItem(req.file)

    res.status(200).json({message: "You at least made it this far..."});
  } catch (err) {
    console.log('error')
    // res
    //   .status(err.status || 500)
    //   .json({ message: err.message || 'Internal server error.' });
  }
};