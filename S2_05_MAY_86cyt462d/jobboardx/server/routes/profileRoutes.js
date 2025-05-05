const express = require('express');
const router = express.Router();

// Import controllers
const { getProfile, updateProfile } = require('../controllers/profileController');

// Import middlewares
const { protect, requireRole } = require('../middlewares/authMiddleware');

// @route   GET /api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', protect, getProfile);

// @route   PUT /api/profile
// @desc    Update current user's profile
// @access  Private (Job Seeker only)
router.put('/', protect, requireRole('seeker'), updateProfile);

module.exports = router;
