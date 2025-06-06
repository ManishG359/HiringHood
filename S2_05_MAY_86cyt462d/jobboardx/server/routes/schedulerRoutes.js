const express = require('express');
const router = express.Router();
const {
    splitSlots,
    calculateTimeline
} = require('../controllers/schedulerController');
const { protect, requireRole } = require('../middlewares/authMiddleware');

router.post('/split', protect, requireRole('employer'), splitSlots);
router.post('/timeline', calculateTimeline);

router.post('/timeline/save', protect, requireRole('employer'),calculateTimeline );
module.exports = router;