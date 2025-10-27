const express = require('express');
const router = express.Router();
const Member = require('../models/member');

// Get all members
router.get('/', async (req, res) => {
  try {
    const members = await Member.getAll();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get member by ID
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.getById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new member
router.post('/', async (req, res) => {
  try {
    const member = await Member.create(req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a member
router.put('/:id', async (req, res) => {
  try {
    const member = await Member.update(req.params.id, req.body);
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a member
router.delete('/:id', async (req, res) => {
  try {
    await Member.delete(req.params.id);
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

