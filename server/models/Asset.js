const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  assetName: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Electronics', 'Lab Equipment', 'Projector', 'VR Headset', 'Drone', '3D Printer', 'Sports Equipment'],
    default: 'Electronics' 
  },
  status: { 
    type: String, 
    enum: ['Available', 'Reserved', 'Maintenance', 'In Use'],
    default: 'Available' 
  },
  location: { type: String, required: true },
  building: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  image: { type: String },
  availability: { type: Boolean, default: true },
  qrCode: { type: String },
  serialNumber: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema);
