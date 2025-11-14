import express from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import cors from 'cors';
import { createUser, getUserData } from './user.js';
import { client } from './mongo.js';
import { getResponse } from './genai.js';
const db = client.db("ProjectDataBase");

// -----------------------
// Constants
// -----------------------
const PORT = 3000;
const FRONTEND_ORIGIN = 'https://localhost:5173';
const DATABASE = 'ProjectDataBase'; // Ensure this matches your MongoDB database name
const USER_COLLECTION = 'Users'; // Ensure this matches your MongoDB collection name

// -----------------------
// Create Express app
// -----------------------
const app = express();

// -----------------------
// Enable CORS
// -----------------------
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true
}));

// -----------------------
// Middleware to validate access tokens
// -----------------------
const validateAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});

// -----------------------
// Routes
// -----------------------

// Health check
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Create user
app.get('/api/create-user', validateAuth, async (req, res) => {
  try {
    const authUser = await getUserData(req.headers.authorization);
    const created = await createUser(authUser.sub, authUser.name);
    res.send(created ? "User created" : "User already exists");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Generate AI response
app.get('/api/generate', validateAuth, async (req, res) => {
  try {
    const msg = req.query.contents;
    const response = await getResponse(msg);
    res.send(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

// Fetch user by ID
// Fetch user by Auth0 ID
app.get('/user/:id', async (req, res) => {
  try {
    const userId = decodeURIComponent(req.params.id);
    const collection = client.db(DATABASE).collection(USER_COLLECTION);
    const user = await collection.findOne({ _id: userId });

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// -----------------------
// Start server
// -----------------------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Server is shutting down...');
  client.close();
  process.exit(0);
});
