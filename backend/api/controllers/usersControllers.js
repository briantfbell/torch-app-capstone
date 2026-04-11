const usersServices = require('../services/usersServices');

exports.getAllUsers = async (req, res) => {
  try {
    const { query } = req;
    const allUsers = await usersServices.getAllUsers(query);

    res.status(200).json({ allUsers });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await usersServices.getUserById(id);

    res.status(200).json({ user });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await usersServices.updateUser(req.params.id, req.body);

    res.status(200).json({
      updatedUser,
      message: `'${updatedUser.username}' has been successfully updated.`,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Internal server error.',
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await usersServices.deleteUser(req.params.id);

    res.status(200).json({
      deletedUser,
      message: `'${deletedUser.username}' was successfully deleted.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};
