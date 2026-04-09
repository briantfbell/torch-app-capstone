const endItemsServices = require("../services/endItemsServices");

exports.getAllEndItems = async (req, res) => {
  try {
    const { query } = req;
    const data = await endItemsServices.getAllEndItems(query);

    res.status(200).json({ allEndItems: data });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error." });
  }
};

exports.getEndItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const endItem = await endItemsServices.getEndItemById(id);

    res.status(200).json({ endItem: endItem });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error." });
  }
};

exports.createEndItem = async (req, res) => {
  try {
    const newEndItem = await endItemsServices.createEndItem(req.body);

    res.status(201).json({
      newEndItem: newEndItem,
      message: `LIN: ${newEndItem.lin} has been successfully created.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error." });
  }
};

exports.updateEndItem = async (req, res) => {
  try {
    const updatedEndItem = await endItemsServices.updateEndItem(
      req.params.id,
      req.body,
    );

    res.status(200).json({
      updatedEndItem: updatedEndItem,
      message: `LIN: ${updatedEndItem.lin} has been successfully updated.`,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || "Internal server error.",
    });
  }
};

exports.markEndItemComplete = async (req, res) => {
  try {
    const updatedEndItem = await endItemsServices.updateEndItem(req.params.id, {
      completed: true,
    });

    res.status(200).json({
      updatedEndItem,
      message: `LIN: ${updatedEndItem.lin} has been marked complete.`,
    });
  } catch (err) {
    console.error("markEndItemComplete error:", err);
    res.status(err.status || 500).json({
      message: err.message || "Internal server error.",
    });
  }
};

exports.deleteEndItem = async (req, res) => {
  try {
    const deletedEndItem = await endItemsServices.deleteEndItem(req.params.id);

    res.status(200).json({
      deletedEndItem: deletedEndItem,
      message: `LIN: ${deletedEndItem.lin} was successfully deleted.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || "Internal server error." });
  }
};
