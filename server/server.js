import express from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import cors from 'cors';
import fetch from 'node-fetch'; // Make sure you have node-fetch installed
import { createUser } from './user.js';
import { client } from './mongo.js';

// Create an Express app
const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your Vue dev server
  credentials: true // Allow credentials like Authorization headers
}));

// Middleware to validate access tokens
const validateAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});

/**
 * ✅ CarQuery Proxy Endpoint
 * This routes frontend calls to CarQuery via your backend
 */
app.get('/api/carquery', async (req, res) => {
  try {
    const { cmd, year, make, model } = req.query;
    if (!cmd) return res.status(400).json({ error: 'Missing required parameter: cmd' });

    const params = new URLSearchParams({ cmd });
    if (year) params.append('year', year);
    if (make) params.append('make', make);
    if (model) params.append('model', model);

    const carQueryUrl = `https://www.carqueryapi.com/api/0.3?${params.toString()}&callback=?`;

    const response = await fetch(carQueryUrl);
    const text = await response.text();

    // Remove JSONP wrapper: ?({...});
    const jsonStr = text.replace(/^\?\((.*)\);?$/, '$1');
    const data = JSON.parse(jsonStr);

    res.json(data);
  } catch (error) {
    console.error('Error fetching CarQuery data:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle data' });
  }
});

/**
 * ✅ Auth0-protected user creation route
 */
app.get('/api/create-user', validateAuth, async (req, res) => {
  try {
    const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: { authorization: req.headers.authorization },
    });

    const user = await response.json();
    const created = await createUser(user.sub, user.name);

    res.send(created ? "User created" : "User already exists");
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).send('Failed to create user');
  }
});

/**
 * Root health check
 */
app.get('/', (req, res) => {
  res.send('Server is running!');
});


// Start the server
(function startServer() {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });

  process.on('SIGINT', () => {
    console.log('Server is shutting down...');
    client.close();
    process.exit(0);
  });
})();
