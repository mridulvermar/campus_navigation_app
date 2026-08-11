const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const seedDatabase = require('./seedData');

const run = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('❌ [Seed Error] MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    const sanitizedUri = mongoUri.replace(/\/\/(.*):(.*)@/, '//$1:****@');
    console.log(`[Seed] Connecting to MongoDB: ${sanitizedUri}`);

    const conn = await mongoose.connect(mongoUri);
    console.log(`[Seed] Successfully connected to MongoDB Host: ${conn.connection.host} | Database: ${conn.connection.name}`);

    await seedDatabase();

    await mongoose.connection.close();
    console.log('[Seed] Database connection closed safely.');
    process.exit(0);
  } catch (error) {
    console.error('❌ [Seed Failed]:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

run();

