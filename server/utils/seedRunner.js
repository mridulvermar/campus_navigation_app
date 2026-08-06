require('dotenv').config();
const mongoose = require('mongoose');
const seedDatabase = require('./seedData');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campus_navigation_db');
    await seedDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Seed Failed:', error);
    process.exit(1);
  }
};

run();
