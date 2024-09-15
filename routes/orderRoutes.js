const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');

// Create Order
router.post('/create', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Order
router.put('/update', async (req, res) => {
  try {
    const { filter, update } = req.body;
    const success = await Order.update(filter, update);
    res.status(200).json({ success });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Order
router.delete('/delete', async (req, res) => {
  try {
    const success = await Order.delete(req.body);
    res.status(200).json({ success });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// List Orders
router.get('/list', async (req, res) => {
  try {
    const orders = await Order.list();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search Order
router.get('/search', async (req, res) => {
  try {
    const { attribute, value } = req.query;
    const orders = await Order.search(attribute, value);
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
