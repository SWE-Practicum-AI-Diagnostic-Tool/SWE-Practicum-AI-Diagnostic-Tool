import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const app = express();

async function start() {
  const mongod = await MongoMemoryServer.create({
    instance: {
      dbName: 'localdb',
      dbPath: './data/mongodb'  // saves data persistently here
    }
  });

  const uri = mongod.getUri();
  await mongoose.connect(uri);
  console.log('✅ MongoDB started and connected!');

  app.get('/', (_, res) => res.send('MongoDB is running!'));
  app.listen(3000, () => console.log('🚀 Server on http://localhost:3000'));
}

start();
