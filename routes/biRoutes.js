const express = require('express');
const router = express.Router();
const BIModel = require('../models/BIModel'); 

// Route to get sales analysis by supplier
router.get('/sales_analysis_by_supplier', async (req, res) => {
  try {
    const analysis = await BIModel.getSalesAnalysisBySupplier();
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error fetching sales analysis by supplier:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get top N best-selling products
router.get('/top_best_sellers', async (req, res) => {
  try {
    const n = parseInt(req.query.n, 10); // Get 'n' from query params
    const bestSellers = await BIModel.getTopBestSellers(n);
    res.status(200).json(bestSellers);
  } catch (error) {
    console.error('Error fetching top best sellers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get average spend per user
router.get('/average_spend_per_user', async (req, res) => {
  try {
    const averageSpend = await BIModel.getAverageSpendPerUser();
    res.status(200).json(averageSpend);
  } catch (error) {
    console.error('Error fetching average spend per user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get revenue from a shop within a given time range
router.get('/revenue_from_shop', async (req, res) => {
  try {
    const { shop_id, start_date, end_date } = req.query; // Get parameters from query
    const revenue = await BIModel.getRevenueFromShop(shop_id, start_date, end_date);
    res.status(200).json(revenue);
  } catch (error) {
    console.error('Error fetching revenue from shop:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
