const AbstractModel = require('./abstractModel');

class Cart extends AbstractModel {
  constructor() {
    super('carts'); // Specifies the MongoDB collection name
  }

  // Basic validation to check fields and types
  validateCart(cart) {
    const validAttributes = ['products', 'user', 'uuid', 'shop'];
    const requiredAttributes = {
      products: 'object', // Assuming products is an array
      user: 'string',
      uuid: 'string',
      shop: 'string' // Reference to the shop ID
    };

    // Check for missing fields
    for (let attr of Object.keys(requiredAttributes)) {
      if (!(attr in cart)) {
        throw new Error(`Missing required field: ${attr}`);
      }
    }

    // Check for extra fields and correct types
    for (let key in cart) {
      if (!validAttributes.includes(key)) {
        throw new Error(`Invalid field: ${key}`);
      }
      if (typeof cart[key] !== requiredAttributes[key]) {
        throw new Error(`Invalid type for field ${key}. Expected ${requiredAttributes[key]}.`);
      }
    }
  }

  async create(cart) {
    // Validate cart attributes
    this.validateCart(cart);
    return super.create(cart); // Use the inherited create method
  }
}

module.exports = new Cart();
