const { connectToDB, ensureCollectionExists } = require('../config/db');

class AbstractModel {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.db = null;
    this.collection = null;
  }

  async init() {
    if (!this.db) {
      try {
        this.db = await connectToDB(); // Await the database connection
        await ensureCollectionExists(this.collectionName); // Ensure the collection exists
        this.collection = this.db.collection(this.collectionName); // Set the collection
        console.log(`Collection ${this.collectionName} initialized`);
      } catch (error) {
        console.error(`Error initializing collection ${this.collectionName}:`, error);
        throw error;
      }
    }
  }

  // Create a new document
  async create(document) {
    await this.init(); // Ensure collection is initialized
    try {
      const result = await this.collection.insertOne(document);
      if (result.insertedId) {
        console.log(`Document inserted with ID: ${result.insertedId}`);
        return { ...document, _id: result.insertedId }; // Return the document with the inserted ID
      } else {
        throw new Error('Failed to insert document');
      }
    } catch (error) {
      console.error(`Error creating document in ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Update an existing document by filter
  async update(filter, update) {
    await this.init(); // Ensure collection is initialized
    try {
      const result = await this.collection.updateOne(filter, { $set: update });
      if (result.modifiedCount > 0) {
        console.log(`Document updated with filter: ${JSON.stringify(filter)}`);
        return true; // Return success
      } else {
        console.log('No documents matched the filter for update.');
        return false; // Return failure
      }
    } catch (error) {
      console.error(`Error updating document in ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Delete a document by filter
  async delete(filter) {
    await this.init(); // Ensure collection is initialized
    try {
      const result = await this.collection.deleteOne(filter);
      if (result.deletedCount > 0) {
        console.log(`Document deleted with filter: ${JSON.stringify(filter)}`);
        return true; // Return success
      } else {
        console.log('No documents matched the filter for deletion.');
        return false; // Return failure
      }
    } catch (error) {
      console.error(`Error deleting document from ${this.collectionName}:`, error);
      throw error;
    }
  }

  // List all documents or by a specific query
  async list(query = {}) {
    await this.init(); // Ensure collection is initialized
    try {
      const documents = await this.collection.find(query).toArray();
      console.log(`query: ${this.query}, Listing documents from ${this.collectionName}`);
      return documents; // Return all documents that match the query
    } catch (error) {
      console.error(`Error listing documents from ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Search for documents based on attribute name and value
  async search(attribute, value) {
    await this.init(); // Ensure collection is initialized
    try {
      const query = { [attribute]: value }; // Dynamic query creation
      const documents = await this.collection.find(query).toArray();
      console.log(`Searching documents in ${this.collectionName} by ${attribute}: ${value}`);
      return documents; // Return all documents that match the search
    } catch (error) {
      console.error(`Error searching in ${this.collectionName}:`, error);
      throw error;
    }
  }
}

module.exports = AbstractModel;
