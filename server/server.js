// import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import express from 'express';
import { auth, requiredScopes } from 'express-oauth2-jwt-bearer';
import cors from 'cors';

dotenv.config(); // loads .env file into process.env

const uri = process.env.MONGODB_URI;

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your Vue dev server
  credentials: true // If you’re using cookies or Authorization headers
}));

// Middleware to validate access tokens
const validateAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

function startServer() {
  app.get('/', (req, res) => {
    res.send('Server is running!');
  });

  app.get('/api/protected', validateAuth, (req, res) => {
    res.send('Protected route');
  });

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });

  process.on('SIGINT', () => {
    console.log('Server is shutting down...');
    client.close();
    process.exit(0);
  });
}

async function run() {
  try {
    await client.connect();

    const db = client.db("sample_mflix");           // <— your database
    const collection = db.collection("movies");     // <— pick any collection

    // Fetch first 5 movies
    const movies = await collection.find().limit(5).toArray();

    console.log("Sample Movies:");
    console.log(movies);

    app.get('/', (req, res) => {
      res.send('Server is running!')
    })

    // Connect to server
    const server = app.listen(3000, () => console.log('Server on http://localhost:3000'));

    // Close server on exit
    process.on('SIGINT', () => {
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error("Error reading data:", error);
  } finally {
    await client.close();
  }
}

// run();

startServer();