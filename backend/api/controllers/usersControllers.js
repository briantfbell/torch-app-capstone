const userServices = require('../services/userServicess');

exports.getAllUsers = async (req, res) => {
  try {
    const { query } = req;
    const data = await userServices.getAllUsers(query);

    res.status(200).json(data);
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userServices.getUserById(id);

    res.status(200).json(user);
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.getUsersByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const users = await userServices.getUsersByCategory(category);

    res.status(200).json(users);
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const newUser = await userServices.createUser(userId, req.body);

    res.status(201).json({
      newUser: newUser,
      message: `'${newUser.title}' has been successfully posted.`,
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await userServices.updateUser(
      req.params.id,
      req.user,
      req.body,
    );

    res.status(200).json({
      message: `'${updatedUser.title}' has been successfully updated.`,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Internal server error.',
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await userServices.deleteUser(req.params.id, req.user);

    res
      .status(200)
      .json({ message: `'${deletedUser.title}' was successfully deleted.` });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};
