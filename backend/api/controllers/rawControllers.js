const rawServices = require('../services/rawServices');

exports.createRaw = async (req, res) => {
  try {
    const {
      usersData,
      uicsData,
      endItemsData,
      componentsData,
      serialItemsData,
    } = req.body;
    const raw = await rawServices.createRaw(
      usersData,
      uicsData,
      endItemsData,
      componentsData,
      serialItemsData,
    );

    res.status(201).json({
      raw: raw,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};
