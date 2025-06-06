const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect, requireRole } = require('../middlewares/authMiddleware');
router.get('/me', protect, getProfile);
router.put('/', protect, requireRole('seeker'), updateProfile);

module.exports = router;
