const express = require('express');
const router = express.Router();
const Pledge = require('../models/pledge');

// Get all pledges
router.get('/', async (req, res) => {
  try {
    const pledges = await Pledge.getAll();
    res.json(pledges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get total pledged
router.get('/total', async (req, res) => {
  try {
    const total = await Pledge.getTotalPledged();
    res.json({ total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new pledge
router.post('/', async (req, res) => {
  try {
    const pledge = await Pledge.create(req.body);
    res.status(201).json(pledge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a pledge
router.delete('/:id', async (req, res) => {
  try {
    await Pledge.delete(req.params.id);
    res.json({ message: 'Pledge deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

