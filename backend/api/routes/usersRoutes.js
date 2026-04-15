const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const hrhAuth = require('../middleware/hrhAuth');

const router = express.Router();

const {
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} = require('../controllers/usersControllers');

router.get('/:id', getUserById);
router.get('/', getAllUsers);
router.patch('/:id', hrhAuth, updateUser);
router.delete('/:id', hrhAuth, deleteUser);

module.exports = router;
