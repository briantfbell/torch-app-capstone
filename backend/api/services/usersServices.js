const usersModels = require('../models/usersModels');

exports.getAllUsers = async query => {
  return await usersModels.getAllUsers(query);
};

exports.getUserById = async id => {
  const user = await usersModels.getUserById(id);

  if (!user) {
    const error = new Error('User does not exist.');
    error.status = 404;
    throw error;
  }

  return user;
};

exports.updateUser = async (
  userId,
  {
    username,
    name_first,
    name_last,
    email,
    password,
    phone,
    rank,
    uic_id,
    role,
    DoDID,
  },
) => {
  const existingUser = await usersModels.getUserById(userId);

  if (!existingUser) {
    const error = new Error('User does not exist.');
    error.status = 404;
    throw error;
  }

  const noUserChanges =
    existingUser.username === username &&
    existingUser.name_first === name_first &&
    existingUser.name_last === name_last &&
    existingUser.email === email &&
    existingUser.phone === phone &&
    existingUser.rank === rank &&
    existingUser.uic_id === uic_id &&
    existingUser.role === role &&
    existingUser.DoDID === DoDID;

  if (noUserChanges) {
    const error = new Error('No changes detected.');
    error.status = 400;
    throw error;
  }

  const updatedUser = await usersModels.updateUser(userId, {
    username,
    name_first,
    name_last,
    email,
    password,
    phone,
    rank,
    uic_id,
    role,
    DoDID,
  });

  return updatedUser;
};

exports.deleteUser = async id => {
  const existingUser = await usersModels.getUserById(id);

  if (!existingUser) {
    const error = new Error('user does not exist.');
    error.status = 404;
    throw error;
  }

  const deletedUser = await usersModels.deleteUser(id);

  return deletedUser;
};
