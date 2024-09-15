// biRoutes.js
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

module.exports = router;
