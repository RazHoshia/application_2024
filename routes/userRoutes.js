const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// Create User
router.post('/create', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update User
router.put('/update', async (req, res) => {
  try {
    const { filter, update } = req.body;
    const success = await User.update(filter, update);
    res.status(200).json({ success });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete User
router.delete('/delete', async (req, res) => {
  try {
    const success = await User.delete(req.body);
    res.status(200).json({ success });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// List Users
router.get('/list', async (req, res) => {
  try {
    const users = await User.list();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search User
router.get('/search', async (req, res) => {
  try {
    const { attribute, value } = req.query;
    const users = await User.search(attribute, value);
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
