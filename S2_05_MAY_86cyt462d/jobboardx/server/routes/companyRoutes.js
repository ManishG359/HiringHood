const express = require('express');
const router = express.Router();
const Company = require('../models/Company');

router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json({ surveys: company.surveys });
  } catch (err) {
    console.error('❌ Failed to fetch company:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
