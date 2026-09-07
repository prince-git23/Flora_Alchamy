import mongoose from 'mongoose';

/**
 * Connect to MongoDB. Throws on failure so server.js can exit loudly.
 */
export async function connectDB(uri = process.env.MONGO_URI) {
  if (!uri) {
    throw new Error('MONGO_URI is not set. Copy backend/.env.example to backend/.env and configure it.');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });
  return mongoose.connection;
}

export function isConnected() {
  return mongoose.connection.readyState === 1;
}
