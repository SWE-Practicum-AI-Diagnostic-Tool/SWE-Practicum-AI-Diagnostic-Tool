import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const app = express();

let mongod;

async function startDatabase() {
  // Start a local MongoDB instance
  // The dbName is the name of the database you want to use
  // The dbPath is where the data is stored in the file system
  mongod = await MongoMemoryServer.create({
    instance: {
      dbName: 'localdb',
      dbPath: './data/mongodb',
      port: 27017,
    },
  });

  const uri = mongod.getUri();
  await mongoose.connect(uri);
  console.log('✅ MongoDB connected at', uri);
}

async function stopDatabase() {
  if (mongod) {
    await mongoose.connection.close();
    await mongod.stop();
    console.log('🛑 MongoDB stopped');
  }
}

async function startServer() {
  await startDatabase();

  // Example schema + route
  const User = mongoose.model('User', new mongoose.Schema({ name: String }));

  app.get('/users', async (_, res) => {
    const users = await User.find();
    res.json(users);
  });

  app.post('/users/:name', async (req, res) => {
    const user = new User({ name: req.params.name });
    await user.save();
    res.send('✅ User added');
  });

  const server = app.listen(3000, () => console.log('🚀 Server on http://localhost:3000'));

  // Stop database when Node exits
  process.on('SIGINT', async () => {
    await stopDatabase();
    server.close(() => process.exit(0));
  });
}

startServer();
