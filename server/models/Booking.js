const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  bookingType: { type: String, enum: ['Asset', 'Facility'], default: 'Facility' },
  date: { type: String, required: true }, // YYYY-MM-DD
  startTime: { type: String, required: true }, // HH:MM
  endTime: { type: String, required: true }, // HH:MM
  durationHours: { type: Number, default: 1 },
  purpose: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed'],
    default: 'Pending' 
  },
  adminComment: { type: String },
  qrCodeData: { type: String },
  checkedIn: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
