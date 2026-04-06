const express = require('express');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

const {
  getSectionsByCategory,
  getSectionById,
  getAllSections,
  createSection,
  updateSection,
  deleteSection,
} = require('../controllers/sectionsControllers');

// router.get('/:id', auth, getSectionById);
// router.get('/', auth, getAllSections);
// router.post('/', auth, createSection);
// router.patch('/:id', auth, updateSection);
// router.delete('/:id', auth, deleteSection);

module.exports = router;
