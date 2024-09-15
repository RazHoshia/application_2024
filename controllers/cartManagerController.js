const Cart = require('../models/cartModel'); // Import the Cart model
const Product = require('../models/productModel'); // Import the Product model
const Shop = require('../models/shopModel'); // Import the Shop model
const { v4: uuidv4 } = require('uuid'); // To generate UUIDs for carts if needed

class CartManagerController {
  // Add a product to the user's cart
  async addToCart(req, res) {
    try {
      const { user_id, product_id, shop_id } = req.query;

      // Fetch the user's cart
      let cart = await Cart.search('user', user_id);

      // If the cart does not exist, create a new one
      if (cart.length === 0) {
        cart = {
          uuid: uuidv4(),
          user: user_id,
          products: [],
          shop: shop_id
        };
        await Cart.create(cart);
        cart = await Cart.search('user', user_id); // Fetch the newly created cart
      } else {
        cart = cart[0];
      }

      // Check if the product exists in the shop's inventory
      const shop = await Shop.search('uuid', shop_id);
      if (shop.length === 0) {
        return res.status(400).json({ error: 'Shop not found' });
      }
      const shopInventory = shop[0].inventory;
      const inventoryItem = shopInventory.find(item => item.product_uuid === product_id);

      if (!inventoryItem || inventoryItem.amount_in_stock <= 0) {
        return res.status(400).json({ error: 'Product not available in the shop inventory' });
      }

      // Add the product to the cart
      cart.products.push({ product_id });
      await Cart.update({ uuid: cart.uuid }, { products: cart.products });

      res.status(200).json({ message: 'Product added to cart', cart });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get the user's cart
  async getCart(req, res) {
    try {
      const { user_id } = req.query;

      // Fetch the user's cart
      const cart = await Cart.search('user', user_id);
      if (cart.length === 0) {
        return res.status(404).json({ error: 'Cart not found' });
      }

      res.status(200).json({ cart: cart[0] });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Remove a product from the user's cart
  async removeFromCart(req, res) {
    try {
      const { user_id, product_id } = req.query;

      // Fetch the user's cart
      let cart = await Cart.search('user', user_id);
      if (cart.length === 0) {
        return res.status(404).json({ error: 'Cart not found' });
      }
      cart = cart[0];

      // Check if the product is in the cart
      const productIndex = cart.products.findIndex((item) => item.product_id === product_id);
      if (productIndex === -1) {
        return res.status(400).json({ error: 'Product not in cart' });
      }

      // Remove the product from the cart
      cart.products.splice(productIndex, 1);
      await Cart.update({ uuid: cart.uuid }, { products: cart.products });

      res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new CartManagerController();
