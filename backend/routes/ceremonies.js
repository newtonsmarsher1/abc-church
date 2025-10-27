const express = require('express');
const router = express.Router();
const Ceremony = require('../models/ceremony');

// Get all ceremonies
router.get('/', async (req, res) => {
  try {
    const ceremonies = await Ceremony.getAll();
    res.json(ceremonies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get ceremonies by month
router.get('/month/:month/:year', async (req, res) => {
  try {
    const ceremonies = await Ceremony.getByMonth(parseInt(req.params.month), parseInt(req.params.year));
    res.json(ceremonies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new ceremony
router.post('/', async (req, res) => {
  try {
    const ceremony = await Ceremony.create(req.body);
    res.status(201).json(ceremony);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a ceremony
router.delete('/:id', async (req, res) => {
  try {
    await Ceremony.delete(req.params.id);
    res.json({ message: 'Ceremony deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

