const Cart = require('../models/cartModel'); // Import the Cart model
const Product = require('../models/productModel'); // Import the Product model
const Shop = require('../models/shopModel'); // Import the Shop model
const { v4: uuidv4 } = require('uuid'); // To generate UUIDs for carts if needed

class CartManagerController {
  // Add a product to the user's cart
  async addToCart(req, res) {
    try {
      const { cart_id, product_id } = req.query;

      // Fetch the user's cart
      let cart = await Cart.search('uuid', cart_id);

      // If the cart does not exist, create a new one
      if (cart.length === 0) {
        return res.status(404).json({ error: 'Cart not found' });
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

      // Add the product to the cart or update the quantity
      if (cart.products[product_id]) {
        cart.products[product_id] += 1; // Increment quantity if already in cart
      } else {
        cart.products[product_id] = 1; // Add new product with quantity 1
      }

      await Cart.update({ uuid: cart.uuid }, { $set: { products: cart.products } });

      res.status(200).json({ message: 'Product added to cart', cart });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get the user's cart - creates new one if does not exist
  async getCart(req, res) {
    try {
      const { user_id, shop_id } = req.query; // Get user_id and shop_id from the query parameters
  
      // Fetch all carts associated with the user_id
      let carts = await Cart.search('user', user_id);
      let cart = carts.find(cart => cart.shop === shop_id);
  
      // If no cart exists for the given user and shop, create a new one
      if (!cart) {
        cart = {
          uuid: uuidv4(),
          user: user_id,
          products: [],
          shop: shop_id
        };
        await Cart.create(cart);
        
        // Fetch the newly created cart for confirmation
        carts = await Cart.search('user', user_id);
        cart = carts.find(cart => cart.shop === shop_id);
      }
  
      // Return the cart
      res.status(200).json({ cart });
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
      if (!cart.products[product_id]) {
        return res.status(400).json({ error: 'Product not in cart' });
      }

      // Decrease the quantity or remove the product if the quantity reaches zero
      cart.products[product_id] -= 1;
      if (cart.products[product_id] <= 0) {
        delete cart.products[product_id]; // Remove the product entirely from the cart
      }

      await Cart.update({ uuid: cart.uuid }, { $set: { products: cart.products } });

      res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new CartManagerController();
