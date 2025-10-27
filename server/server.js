import express from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import cors from 'cors';
import { createUser } from './user.js';
import { client } from './mongo.js';

// Create an Express app
const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your Vue dev server
  credentials: true // If you’re using cookies or Authorization headers
}));

// Middleware to validate access tokens
const validateAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});

/**
 * Start the server
 */
(function startServer() {
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
})();