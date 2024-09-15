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

  // Get top N best-selling products
  async getTopBestSellers(n) {
    await this.init(); // Ensure database is initialized
    try {
      const result = await this.db.collection('products').aggregate([
        {
          $sort: { amount_sold: -1 } // Sort by amount_sold in descending order
        },
        {
          $limit: n // Limit to the top N products
        },
        {
          $project: {
            _id: 0,
            productName: "$name", // Include product name
            amountSold: "$amount_sold",
            revenue: { $multiply: ["$price", "$amount_sold"] } // Calculate revenue per product
          }
        }
      ]).toArray();

      return result;
    } catch (error) {
      console.error('Error fetching top best sellers:', error);
      throw error;
    }
  }

  // Get average spend per user
  async getAverageSpendPerUser() {
    await this.init(); // Ensure database is initialized
    try {
      const result = await this.db.collection('orders').aggregate([
        {
          $group: {
            _id: "$user", // Group by user UUID
            totalSpent: { $sum: "$total_amount" } // Sum of total_amount per user
          }
        },
        {
          $lookup: {
            from: "users", // Join with users collection
            localField: "_id",
            foreignField: "uuid",
            as: "userDetails"
          }
        },
        {
          $unwind: "$userDetails" // Unwind the user details
        },
        {
          $project: {
            _id: 0,
            userName: "$userDetails.name", // Include user name
            totalSpent: 1
          }
        }
      ]).toArray();

      return result;
    } catch (error) {
      console.error('Error calculating average spend per user:', error);
      throw error;
    }
  }

  // Get revenue from a shop within a given time range
  async getRevenueFromShop(shopId, startDate, endDate) {
    await this.init(); // Ensure database is initialized
    try {
      const result = await this.db.collection('orders').aggregate([
        {
          $match: {
            shop: shopId, // Filter by shop ID
            date: { $gte: new Date(startDate), $lte: new Date(endDate) } // Filter by date range
          }
        },
        {
          $group: {
            _id: "$shop",
            totalRevenue: { $sum: "$total_amount" } // Sum of total_amount per shop
          }
        }
      ]).toArray();

      return result;
    } catch (error) {
      console.error('Error calculating revenue from shop:', error);
      throw error;
    }
  }
}

module.exports = new BIModel();
