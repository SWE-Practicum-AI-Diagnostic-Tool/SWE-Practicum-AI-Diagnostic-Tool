// import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config(); // loads .env file into process.env

const uri = process.env.MONGODB_URI;

// const app = express();

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const db = client.db("sample_mflix");           // <— your database
    const collection = db.collection("movies");     // <— pick any collection

    // Fetch first 5 movies
    const movies = await collection.find().limit(5).toArray();

    console.log("🎬 Sample Movies:");
    console.log(movies);

    app.get('/', (req, res) => {
      res.send('Server is running!')
    })

    // Connect to server
    const server = app.listen(3000, () => console.log('🚀 Server on http://localhost:3000'));

  } catch (error) {
    console.error("❌ Error reading data:", error);
  } finally {
    await client.close();
  }
}

run();
