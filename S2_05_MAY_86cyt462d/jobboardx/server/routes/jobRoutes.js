const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs
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


module.exports = router;
