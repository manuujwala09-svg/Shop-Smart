const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = "freshcart";

// Helper to connect to DB
async function getCollection(collectionName) {
  if (!client.isConnected?.()) await client.connect();
  return client.db(dbName).collection(collectionName);
}

// Get all categories
router.get('/categories', async (req, res) => {
  const collection = await getCollection('categories');
  const data = await collection.find().toArray();
  res.json(data);
});

// Get all products
router.get('/products', async (req, res) => {
  const collection = await getCollection('products');
  const data = await collection.find().toArray();
  res.json(data);
});

// Get all banners
router.get('/banners', async (req, res) => {
  const collection = await getCollection('banners');
  const data = await collection.find().toArray();
  res.json(data);
});

// Get all deals
router.get('/deals', async (req, res) => {
  const collection = await getCollection('deals');
  const data = await collection.find().toArray();
  res.json(data);
});

module.exports = router;
