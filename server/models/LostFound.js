const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['Lost', 'Found'], required: true },
  category: { type: String, default: 'Electronics' },
  location: { type: String, required: true },
  date: { type: String, required: true },
  contactPhone: { type: String, required: true },
  contactEmail: { type: String, required: true },
  status: { type: String, enum: ['Open', 'Claimed', 'Resolved'], default: 'Open' },
  image: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('LostFound', lostFoundSchema);
