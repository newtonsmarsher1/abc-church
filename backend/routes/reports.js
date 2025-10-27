const express = require('express');
const router = express.Router();
const Contribution = require('../models/contribution');
const Ceremony = require('../models/ceremony');

// Get monthly report
router.get('/monthly', async (req, res) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    
    const totalContributions = await Contribution.getMonthlyTotal(month, year);
    const ceremonies = await Ceremony.getByMonth(month, year);
    
    res.json({
      month,
      year,
      monthName: now.toLocaleString('en-US', { month: 'long' }),
      totalContributions,
      ceremonyCount: ceremonies.length,
      ceremonies
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

