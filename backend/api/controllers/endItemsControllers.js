const endItemsServices = require('../services/endItemsServices');

exports.getAllEndItems = async (req, res) => {
  try {
    const { query } = req;
    const data = await endItemsServices.getAllEndItems(query);

    res.status(200).json(data);
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.getEndItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const endItem = await endItemsServices.getEndItemById(id);

    res.status(200).json(endItem);
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.getEndItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const endItems = await endItemsServices.getEndItemsByCategory(category);

    res.status(200).json(endItems);
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.createEndItem = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const newEndItem = await endItemsServices.createEndItem(userId, req.body);

    res.status(201).json({
      newEndItem: newEndItem,
      message: `'${newEndItem.title}' has been successfully posted.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.updateEndItem = async (req, res) => {
  try {
    const updatedEndItem = await endItemsServices.updateEndItem(
      req.params.id,
      req.user,
      req.body,
    );

    res.status(200).json({
      message: `'${updatedEndItem.title}' has been successfully updated.`,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Internal server error.',
    });
  }
};

exports.deleteEndItem = async (req, res) => {
  try {
    const deletedEndItem = await endItemsServices.deleteEndItem(
      req.params.id,
      req.user,
    );

    res
      .status(200)
      .json({ message: `'${deletedEndItem.title}' was successfully deleted.` });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};
