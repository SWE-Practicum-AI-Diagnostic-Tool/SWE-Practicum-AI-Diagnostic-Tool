// import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import express from 'express';
import { auth, requiredScopes } from 'express-oauth2-jwt-bearer';
import cors from 'cors';

dotenv.config(); // loads .env file into process.env

const uri = process.env.MONGODB_URI;
const DATABASE = "ProjectDataBase";
const USER_COLLECTION = "Users";

console.log(uri);

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

async function userExists(userid) {
  // Check if a user exists using the MongoClient
  const collection = client.db(DATABASE).collection(USER_COLLECTION);
  const res = await collection.findOne({ _id: userid });
  return res;
}

async function createUser(userid, name) {
  if (await userExists(userid)) {
    console.log("User already exists:", userid);
    return false;
  }

  // Create a user using the MongoClient
  const collection = client.db(DATABASE).collection(USER_COLLECTION);
  const user = { _id: userid, name: name };
  await collection.insertOne(user);
  
  console.log("User created:", user);
  
  return true
}

function startServer() {
  app.get('/', (req, res) => {
    res.send('Server is running!');
  });

  app.get('/api/create-user', validateAuth, async (req, res) => {
    const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: { authorization: req.headers.authorization },
    });
    
    const user = await response.json();
    
    const created = await createUser(user.sub, user.name);

    res.send(created ? "User created" : "User already exists");
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