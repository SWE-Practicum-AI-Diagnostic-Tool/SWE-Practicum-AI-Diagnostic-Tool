import express from 'express';
// import https from 'https';
// import fs from 'fs';
import { auth } from 'express-oauth2-jwt-bearer';
import cors from 'cors';
import { createUser, getUserDB, updateUserDB, getUserAuth0, getFlowcharts, saveFlowchart } from './user.js';
import { client } from './mongo.js';
import { getResponse, generateQuestionsPrompt, generateFlowchartPrompt } from './genai.js';
import { getFields } from './helper.js';

// const options = {
//   key: fs.readFileSync('CARIT_PRIVATEKEY.key'),
//   cert: fs.readFileSync('CARIT_CRT.crt'),
//   passphrase: 'carit'
// };

// Create an Express app
const app = express();

app.use(express.json());

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
    const user = await getUserAuth0(req.headers.authorization);
    const msg = await createUser(user.sub, user.name, user.email);
    res.send(msg);
  });

  app.post('/api/generate', validateAuth, async (req, res) => {
    const msg = req.body.contents;
    const response = await getResponse(msg);
    res.send(response);
  });
  
  app.post('/api/gen-questions', validateAuth, async (req, res) => {
    const { vehicle, issues } = req.body;
    const msg = generateQuestionsPrompt(vehicle, issues);
    const response = await getResponse(msg);
    res.send(response);
  });

  app.post('/api/gen-flowchart', validateAuth, async (req, res) => {
    const { vehicle, issues, responses } = req.body;
    const msg = generateFlowchartPrompt(vehicle, issues, responses);
    const response = await getResponse(msg);
    const user = await getUserAuth0(req.headers.authorization);
    await saveFlowchart(user.sub, response, vehicle, issues, responses);
    res.send(response);
  });

  app.get('/api/get-flowcharts', validateAuth, async (req, res) => {
    const user = await getUserAuth0(req.headers.authorization);
    const flowcharts = await getFlowcharts(user.sub);
    res.send(flowcharts);
  });

  app.get('/api/get-user-data', validateAuth, async (req, res) => {
    const user = await getUserAuth0(req.headers.authorization);
    const dbUser = await getUserDB(user.sub);
    let readData = getFields(dbUser, ["name", "email"]);
    res.send(readData);
  });

  app.post('/api/set-user-data', validateAuth, async (req, res) => {
    let setData = getFields(req.body, ["name", "email"]);
    const user = await getUserAuth0(req.headers.authorization);
    await updateUserDB(user.sub, setData);
    res.send({ success: true });
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