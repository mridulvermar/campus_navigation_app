const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  building: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
  floor: { type: Number, default: 1 },
  capacity: { type: Number, required: true, default: 30 },
  availability: { type: Boolean, default: true },
  currentOccupancy: { type: Number, default: 0 },
  category: { 
    type: String, 
    enum: ['Classroom', 'Seminar Hall', 'Auditorium', 'Sports Ground', 'Labs', 'Meeting Rooms', 'Library Rooms'],
    default: 'Classroom'
  },
  facilities: [{ type: String }],
  qrCode: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
