const express = require('express');
const router = express.Router();
const optimizeJobPost = require('../controllers/optimizeJobPostController');

router.post('/optimize', optimizeJobPost);

module.exports = router;
