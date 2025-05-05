const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middlewares/authMiddleware');
const { applyToJob, getMyApplications, getApplicantsByJobId , withdrawApplication, updateApplicationStatus, getAllApplicantsForEmployer} = require('../controllers/applicationController');

// Seeker routes
router.post('/', protect, requireRole('seeker'), applyToJob);
router.get('/me', protect, requireRole('seeker'), getMyApplications);
router.delete('/:id', protect, requireRole('seeker'), withdrawApplication); 

// Employer route
router.get('/job/:jobId', protect, requireRole('employer'), getApplicantsByJobId);
router.patch('/:id/status', protect, requireRole('employer'), updateApplicationStatus);
router.get('/employer', protect, requireRole('employer'),getAllApplicantsForEmployer);

module.exports = router;
