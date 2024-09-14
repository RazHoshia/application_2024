const express = require('express');
const router = express.Router();
const Cart = require('../models/cartModel');

// Create Cart
router.post('/create', async (req, res) => {
  try {
    const cart = await Cart.create(req.body);
    res.status(201).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Cart
router.put('/update', async (req, res) => {
  try {
    const { filter, update } = req.body;
    const success = await Cart.update(filter, update);
    res.status(200).json({ success });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Cart
router.delete('/delete', async (req, res) => {
  try {
    const success = await Cart.delete(req.body);
    res.status(200).json({ success });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// List Carts
router.get('/list', async (req, res) => {
  try {
    const carts = await Cart.list();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search Cart
router.get('/search', async (req, res) => {
  try {
    const { attribute, value } = req.query;
    const carts = await Cart.search(attribute, value);
    res.status(200).json(carts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
