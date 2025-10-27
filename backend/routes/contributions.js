const express = require('express');
const router = express.Router();
const Contribution = require('../models/contribution');

// Get all contributions
router.get('/', async (req, res) => {
  try {
    const contributions = await Contribution.getAll();
    res.json(contributions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get monthly total
router.get('/monthly-total', async (req, res) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const total = await Contribution.getMonthlyTotal(month, year);
    res.json({ total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new contribution
router.post('/', async (req, res) => {
  try {
    const contribution = await Contribution.create(req.body);
    res.status(201).json(contribution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a contribution
router.delete('/:id', async (req, res) => {
  try {
    await Contribution.delete(req.params.id);
    res.json({ message: 'Contribution deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

