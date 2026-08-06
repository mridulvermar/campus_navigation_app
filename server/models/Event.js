const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  organizer: { type: String, required: true },
  category: { type: String, default: 'Academic' },
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
