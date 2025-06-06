const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  getJobTimeline,
  recalculateTimeline
} = require('../controllers/jobController');

const { protect, requireRole } = require('../middlewares/authMiddleware');

// Public Routes
router.get('/', getAllJobs);
router.get('/my', protect, requireRole('employer'), getMyJobs);
router.get('/:id', getJobById);
 
// Employer-only Routes
router.post('/', protect, requireRole('employer'), createJob);
router.put('/:id', protect, requireRole('employer'), updateJob);
router.delete('/:id', protect, requireRole('employer'), deleteJob);
router.get('/my', protect, requireRole('employer'), getMyJobs);

router.get('/:id/timeline', protect, getJobTimeline);
router.post('/:id/recalculate-timeline', protect, requireRole('employer'), recalculateTimeline);


module.exports = router;
