const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

const {
  getMe,
  registerUser,
  login,
  logout,
} = require('../controllers/authControllers');

// commented sections are TO DO

// router.get('/me', auth, getMe);
// router.post('/register', registerUser);
// router.post('/login', login);
// router.post('/logout', auth, logout);

module.exports = router;
