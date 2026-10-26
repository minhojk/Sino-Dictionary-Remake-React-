import { MongoClient } from 'mongodb';

const client = new MongoClient("mongodb+srv://minhduyvl2000_db_user:aD9rAM4zdfYJodOU@dictionary.hqikrph.mongodb.net/");

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  await client.close();
}