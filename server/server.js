import express from 'express';
// import https from 'https';
// import fs from 'fs';
import { auth } from 'express-oauth2-jwt-bearer';
import cors from 'cors';
import { createUser, getUserData, saveFlowchart } from './user.js';
import { client } from './mongo.js';
import { getResponse } from './genai.js';

// const options = {
//   key: fs.readFileSync('CARIT_PRIVATEKEY.key'),
//   cert: fs.readFileSync('CARIT_CRT.crt'),
//   passphrase: 'carit'
// };

// Create an Express app
const app = express();

// Enable CORS
app.use(cors({
  origin: 'https://localhost:5173', // Allow requests from your Vue dev server
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
    const user = await getUserData(req.headers.authorization);
    const msg = await createUser(user.sub, user.name);
    res.send(msg);
  });

  app.get('/api/generate', validateAuth, async (req, res) => {
    const msg = req.query.contents;
    const response = await getResponse(msg);
    res.send(response);
  });
  
  app.get('/api/gen-questions', validateAuth, async (req, res) => {
    const msg = req.query.contents;
    const response = await getResponse(msg);
    res.send(response);
  })

  app.get('/api/gen-flowchart', validateAuth, async (req, res) => {
    const msg = req.query.contents;
    const response = await getResponse(msg);
    const user = await getUserData(req.headers.authorization);
    await saveFlowchart(user.sub, response);
    res.send(response);
  })

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });

  // https.createServer(options, app).listen(3000, () => {
  //   console.log('Server is running on port 3000');
  // });

  process.on('SIGINT', () => {
    console.log('Server is shutting down...');
    client.close();
    process.exit(0);
  });
})();