const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Shop = require('../models/shopModel');
const Order = require('../models/orderModel'); // Assuming there's an Order model
const { v4: uuidv4 } = require('uuid');

class PaymentController {
  // User pay function
  async userPay(req, res) {
    try {
      const { cart_id } = req.body;

      // Fetch the user's cart
      const cart = await Cart.search('uuid', cart_id);
      if (cart.length === 0) {
        return res.status(404).json({ error: 'Cart not found' });
      }
      const userCart = cart[0];

      // Fetch the shop related to the cart
      const shop = await Shop.search('uuid', userCart.shop);
      if (shop.length === 0) {
        return res.status(404).json({ error: 'Shop not found' });
      }
      const userShop = shop[0];

      // Validate and update stock for each product in the cart
      for (const item of userCart.products) {
        const product = await Product.search('uuid', item.product_id);
        if (product.length === 0) {
          return res.status(404).json({ error: `Product ${item.product_id} not found` });
        }

        // Find the product in the shop inventory
        const inventoryItem = userShop.inventory.find(p => p.product_uuid === item.product_id);
        if (!inventoryItem || inventoryItem.amount_in_stock <= 0) {
          return res.status(400).json({ error: `Product ${item.product_id} is out of stock` });
        }

        // Decrease the stock amount
        inventoryItem.amount_in_stock -= 1;
      }

      // Update the shop inventory in the database
      await Shop.update({ uuid: userShop.uuid }, { inventory: userShop.inventory });

      // Create an order with the details of the purchase and set initial status to 'ordered'
      const newOrder = {
        uuid: uuidv4(),
        user: userCart.user,
        products: userCart.products,
        address: userCart.user.address, // Assuming the address is tied to the user
        date: new Date().toISOString(),
        shop: userShop.uuid,
        status: 'ordered' // Initial status
      };
      const createdOrder = await Order.create(newOrder);

      // Empty the user's cart
      await Cart.update({ uuid: userCart.uuid }, { products: [] });

      res.status(200).json({ message: 'Payment successful', order_id: createdOrder.uuid });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new PaymentController();
