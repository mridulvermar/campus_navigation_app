const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  floorCount: { type: Number, default: 4 },
  category: { 
    type: String, 
    enum: ['Academic', 'Research', 'Library', 'Sports', 'Admin', 'Dining', 'Auditorium'],
    default: 'Academic' 
  },
  openingHours: { type: String, default: '07:30 AM - 10:00 PM' },
  image: { type: String },
  amenities: [{ type: String }],
  emergencyExits: [{
    floor: Number,
    locationName: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Building', buildingSchema);
