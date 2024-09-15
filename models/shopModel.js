const AbstractModel = require('./abstractModel');

class Shop extends AbstractModel {
  constructor() {
    super('shops'); // Specifies the MongoDB collection name
  }

  // Basic validation to check fields and types
  validateShop(shop) {
    const validAttributes = ['uuid', 'name', 'address', 'inventory'];
    const requiredAttributes = {
      uuid: 'string',
      name: 'string',        // Added the name field
      address: 'string',
      inventory: 'object'    // Assuming inventory is an array
    };

    // Check for missing fields
    for (let attr of Object.keys(requiredAttributes)) {
      if (!(attr in shop)) {
        throw new Error(`Missing required field: ${attr}`);
      }
    }

    // Check for extra fields and correct types
    for (let key in shop) {
      if (!validAttributes.includes(key)) {
        throw new Error(`Invalid field: ${key}`);
      }
      if (typeof shop[key] !== requiredAttributes[key]) {
        throw new Error(`Invalid type for field ${key}. Expected ${requiredAttributes[key]}.`);
      }
    }
  }

  async create(shop) {
    // Validate shop attributes
    this.validateShop(shop);
    return super.create(shop); // Use the inherited create method
  }
}

module.exports = new Shop();
