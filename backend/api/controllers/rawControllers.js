const rawServices = require('../services/rawServices');

exports.createRaw = async (req, res) => {
  try {
    const {
      componentsData,
      endItemsData,
      serialItemsData,
      usersData,
      uicsData,
    } = req.body;
    const raw = await rawServices.createRaw(
      componentsData,
      endItemsData,
      serialItemsData,
      usersData,
      uicsData,
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
