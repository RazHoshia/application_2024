// biModel.js
const { connectToDB } = require('../config/db'); // Import the connectToDB function

class BIModel {
  constructor() {
    this.db = null;
  }

  // Initialize the database connection
  async init() {
    if (!this.db) {
      this.db = await connectToDB(); // Connect to the database
    }
  }

  // Get sales analysis by supplier
  async getSalesAnalysisBySupplier() {
    await this.init(); // Ensure database is initialized
    try {
      // Run the aggregation query on the products collection
      const result = await this.db.collection('products').aggregate([
        {
          $group: {
            _id: "$supplier", // Group by supplier UUID
            totalRevenue: { 
              $sum: { $multiply: ["$price", "$amount_sold"] } // Calculate total revenue
            },
            totalProductsSold: { 
              $sum: "$amount_sold" // Count total products sold
            }
          }
        },
        {
          $lookup: {
            from: "suppliers", // Join with suppliers collection
            localField: "_id",
            foreignField: "uuid",
            as: "supplierDetails"
          }
        },
        {
          $unwind: "$supplierDetails" // Unwind the supplier details
        },
        {
          $project: {
            _id: 0, // Exclude the default _id field
            supplierName: "$supplierDetails.name", // Include supplier name from join
            totalRevenue: 1,
            totalProductsSold: 1
          }
        }
      ]).toArray();

      return result;
    } catch (error) {
      console.error('Error performing sales analysis by supplier:', error);
      throw error;
    }
  }
}

module.exports = new BIModel();
