const authModels = require('../models/authModels');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

exports.getMe = async token => {
  if (!token) {
    const error = new Error('Not authenticated.');
    error.status = 401;
    throw error;
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT);
  } catch {
    const error = new Error('Invalid token.');
    error.status = 401;
    throw error;
  }

  const user = await authModels.findUserById(decoded.id);

  if (!user) {
    const error = new Error('User not found.');
    error.status = 401;
    throw error;
  }

  return {
    id: user.id,
    username: user.username,
    name_first: user.name_first,
    name_last: user.name_last,
    email: user.email,
    phone: user.phone,
    created_at: user.created_at,
    updated_at: user.updated_at,
    rank_id: user.rank_id,
    uic: user.uic,
    role: user.role,
  };
};

exports.registerUser = async (
  username,
  name_first,
  name_last,
  email,
  password,
  phone,
  rank,
  uic,
  role,
  dodid,
) => {
  if (
    !username ||
    !name_first ||
    !name_last ||
    !email ||
    !password ||
    !phone ||
    !rank ||
    !uic ||
    !role ||
    !dodid
  ) {
    const error = new Error('All fields are required.');
    error.status = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUic = uic.trim().toUpperCase();
  const normalizedRank = rank.trim().toUpperCase();
  const matchEmail = await authModels.findUserByEmail(normalizedEmail);
  const matchUsername = await authModels.findUserByUsername(username);

  if (matchEmail) {
    const error = new Error('This email is already in use.');
    error.status = 400;
    throw error;
  }

  if (matchUsername) {
    const error = new Error('This username is already in use.');
    error.status = 400;
    throw error;
  }

  const hashWord = await bcrypt.hash(password, SALT_ROUNDS);

  const [newUser] = await authModels.createUser(
    {
      username,
      name_first,
      name_last,
      email: normalizedEmail,
      password: hashWord,
      phone,
      role,
      dodid,
    },
    { rank: normalizedRank },
    { uic: normalizedUic },
  );

  // await authModels.createUserRole(newUser.id, role);

  return {
    username: newUser.username,
    name_first: newUser.name_first,
    name_last: newUser.name_last,
    email: newUser.email,
    phone: newUser.phone,
    rank_id: newUser.rank_id,
    uic: newUser.uic_id,
    role: newUser.role,
    dodid: newUser.dodid,
  };
};

exports.login = async (email, password) => {

  if (!email || !password) {
    const error = new Error('Email and password are required.');
    error.status = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await authModels.findUserByEmail(normalizedEmail);

  if (!user) {
    const error = new Error('User not found.');
    error.status = 401;
    throw error;
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    const error = new Error('Email or password is incorrect.');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      name_first: user.name_first,
      name_last: user.name_last,
      email: user.email,
      phone: user.phone,
      rank_id: user.rank_id,
      uic: user.uic,
      role: user.role,
    },
    process.env.JWT,
    { expiresIn: '7d' },
  );

  return token;
};
