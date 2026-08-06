const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Student', 'Faculty', 'Administrator'], 
    default: 'Student' 
  },
  department: { type: String, default: 'Computer Science & Engineering' },
  profilePhoto: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400' },
  phone: { type: String, default: '+1 (555) 019-2834' },
  favoriteLocations: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
