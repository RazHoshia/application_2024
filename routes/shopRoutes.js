const express = require('express');
const router = express.Router();
const Shop = require('../models/shopModel');

// Create Shop
router.post('/create', async (req, res) => {
  try {
    const shop = await Shop.create(req.body);
    res.status(201).json(shop);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Shop
router.put('/update', async (req, res) => {
  try {
    const { filter, update } = req.body;
    const success = await Shop.update(filter, update);
    res.status(200).json({ success });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Shop
router.delete('/delete', async (req, res) => {
  try {
    const success = await Shop.delete(req.body);
    res.status(200).json({ success });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// List Shops
router.get('/list', async (req, res) => {
  try {
    const shops = await Shop.list();
    res.status(200).json(shops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search Shop
router.get('/search', async (req, res) => {
  try {
    const { attribute, value } = req.query;
    const shops = await Shop.search(attribute, value);
    res.status(200).json(shops);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;


  