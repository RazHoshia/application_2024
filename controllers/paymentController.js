const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Shop = require('../models/shopModel');
const Order = require('../models/orderModel');
const { v4: uuidv4 } = require('uuid');

class PaymentController {
  // User pay function
  async userPay(req, res) {
    try {
      const { cart_id, shipping_address } = req.body;

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

      let totalPrice = 0; // Initialize total price

      // Validate and update stock for each product in the cart
      for (const [product_id, quantity] of Object.entries(userCart.products)) {
        // Fetch the product from the Product model
        const product = await Product.search('uuid', product_id);
        if (product.length === 0) {
          return res.status(404).json({ error: `Product ${product_id} not found` });
        }
        const productDetails = product[0];

        // Find the inventory item in the shop's inventory
        const inventoryItem = userShop.inventory[product_id];
        if (!inventoryItem || inventoryItem.quantity < quantity) {
          return res.status(400).json({ error: `Insufficient stock for product ${product_id}` });
        }

        // Decrease the stock amount in the shop's inventory
        inventoryItem.quantity -= quantity;

        // Update the specific product quantity in the shop's inventory in the database
        await Shop.update(
          { uuid: userShop.uuid, [`inventory.${product_id}`]: { $exists: true } },
          { $set: { [`inventory.${product_id}.quantity`]: inventoryItem.quantity } }
        );

        // Update amount_sold for the product in the general Product model
        await Product.update(
          { uuid: product_id },
          { $inc: { amount_sold: quantity } } // Increment the amount sold by the quantity purchased
        );

        // Calculate total price for the order
        totalPrice += productDetails.price * quantity; // Add the price of the product times its quantity
      }

      // Create an order with the details of the purchase, including total price and initial status
      const newOrder = {
        uuid: uuidv4(),
        user: userCart.user,
        products: userCart.products,
        address: shipping_address, // Use the provided shipping address
        date: new Date().toISOString(),
        shop: userShop.uuid,
        status: 'ordered', // Initial status
        price: totalPrice // Add total price to the order
      };
      const createdOrder = await Order.create(newOrder);

      // Empty the user's cart
      await Cart.update({ uuid: userCart.uuid }, { $set: { products: {} } });

      res.status(200).json({ message: 'Payment successful', order_id: createdOrder.uuid });
    } catch (error) {
      console.error(`Error processing payment: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new PaymentController();
