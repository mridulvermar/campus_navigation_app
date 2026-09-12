const mongoose = require('mongoose');

const connectDB = async () => {
  mongoose.set('bufferCommands', false);
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('[Database] MONGODB_URI environment variable is missing. Running in volatile fallback mode.');
    return;
  }
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[Database] MongoDB Connected to Host: ${conn.connection.host} | DB: ${conn.connection.name}`);
  } catch (error) {
    console.warn(`[Database Warning] MongoDB connection failed: ${error.message}. Running in volatile memory fallback mode.`);
  }
};

module.exports = connectDB;

