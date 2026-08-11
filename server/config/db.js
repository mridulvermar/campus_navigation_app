const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is missing.');
    }
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`[Database] MongoDB Connected to Host: ${conn.connection.host} | DB: ${conn.connection.name}`);
  } catch (error) {
    console.warn(`[Database Warning] MongoDB connection failed: ${error.message}. Running in volatile memory fallback mode.`);
  }
};

module.exports = connectDB;

