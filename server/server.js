import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Express is a package for building HTTP servers
const app = express();

async function getUsers() {
  const UserSchema = new mongoose.Schema({
    id_token: String
  });
  const User = mongoose.model('User', UserSchema, 'User');

  return await User.find();
}

async function start() {
  // Start a local MongoDB instance
  // The dbName is the name of the database you want to use
  // The dbPath is where the data is stored in the file system
  const mongod = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbName: 'local',
      dbPath: './data/mongodb'
    }
  });

  // Connect to the local MongoDB instance
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  console.log('✅ MongoDB started and connected!');

  console.log(await getUsers());

  // Define routes
  app.get('/', (_, res) => res.send('MongoDB is running!'));

  // Start the server
  app.listen(3000, () => console.log('🚀 Server on http://localhost:3000'));
}

start();
