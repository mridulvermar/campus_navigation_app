const mongoose = require('mongoose');

const navigationHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  distance: { type: Number, required: true }, // meters
  timeTaken: { type: Number, required: true }, // minutes
  mode: { type: String, default: 'Walking' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NavigationHistory', navigationHistorySchema);
