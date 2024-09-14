const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://localhost:27017';
const databaseName = 'haim';

let db;

const connectToDB = async () => {
  if (db) return db; // Return the existing db connection
  try {
    const client = await MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(databaseName);
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error("Can't connect to the database", error);
    throw error;
  }
};

module.exports = { connectToDB };
