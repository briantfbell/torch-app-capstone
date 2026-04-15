const express = require('express');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

const {
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} = require('../controllers/usersControllers');

router.get('/:id', auth, getUserById);
router.get('/', auth, getAllUsers);
router.patch('/:id', adminAuth, updateUser);
router.delete('/:id', adminAuth, deleteUser);

module.exports = router;
