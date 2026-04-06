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

  const {
    id,
    username,
    name_first,
    name_last,
    email,
    phone,
    created_at,
    updated_at,
    rank,
    uic,
    role,
    DoDID,
  } = user;

  return {
    id,
    username,
    name_first,
    name_last,
    email,
    phone,
    created_at,
    updated_at,
    rank,
    uic,
    role,
    DoDID,
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
  DoDID,
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
    !DoDID
  ) {
    const error = new Error('All fields are required.');
    error.status = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();
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
  // TO DO: change 'password' to actual admin verify
  const adminHashWord = await bcrypt.hash('password', SALT_ROUNDS);
  const isAdmin = await bcrypt.compare(password, adminHashWord);

  const [newUser] = await authModels.createUser({
    role: isAdmin ? 'admin' : 'user',
    username,
    name_first,
    name_last,
    email: normalizedEmail,
    password: hashWord,
    phone,
    rank,
    uic,
  });

  return {
    username :
    name_first :
    name_last :
    email :
    phone :
    rank :
    uic :
    role :
    DoDID :
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
    const error = new Error('Email or password is incorrect.');
    error.status = 404;
    throw error;
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    const error = new Error('Email or password is incorrect.');
    error.status = 404;
    throw error;
  }

  const {
    id,
    role,
    username,
    name_first,
    name_last,
    email,
    phone,
    created_at,
    updated_at,
    rank,
    uic,
  } = user;

  const token = jwt.sign(
    {
      id,
      role,
      username,
      name_first,
      name_last,
      email,
      phone,
      created_at,
      updated_at,
      rank,
      uic,
    },
    process.env.JWT,
    { expiresIn: '7d' },
  );

  return token;
};
