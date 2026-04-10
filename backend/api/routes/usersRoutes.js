const express = require('express');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

const {
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} = require('../controllers/usersControllers');

router.get('/:id', getUserById);
router.get('/', getAllUsers);
router.patch('/:id', adminAuth, updateUser);
router.delete('/:id', adminAuth, deleteUser);

module.exports = router;
