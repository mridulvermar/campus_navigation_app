const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');

const DEMO_USERS = [
  {
    _id: '64e81a0b1234567890abcdef',
    name: 'Admin Director',
    email: 'admin@campus.edu',
    role: 'Administrator',
    department: 'Campus Administration',
    phone: '+91 (555) 019-2834',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
  },
  {
    _id: '64e81a0b1234567890abcdeg',
    name: 'Dr. Rajesh Kumar',
    email: 'faculty@campus.edu',
    role: 'Faculty',
    department: 'Electrical & Electronics',
    phone: '+91 (555) 019-2835',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
  },
  {
    _id: '64e81a0b1234567890abcdeh',
    name: 'Aditi Sharma',
    email: 'student@campus.edu',
    role: 'Student',
    department: 'Computer Science & Engineering',
    phone: '+91 (555) 019-2836',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400'
  }
];

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id ? user._id.toString() : user.id, 
      email: user.email, 
      role: user.role, 
      name: user.name,
      department: user.department 
    },
    process.env.JWT_SECRET || 'super_secret_campus_jwt_key_2026_antigravity',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }
    
    const normalizedEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      let userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: role || 'Student',
        department: department || 'Computer Science & Engineering',
        phone: phone || '+91 (555) 019-2834'
      });

      const token = generateToken(user);
      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id.toString(),
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          profilePhoto: user.profilePhoto,
          phone: user.phone
        }
      });
    } else {
      // In-memory fallback registration
      const fallbackUser = {
        _id: 'mem_' + Date.now(),
        name: name.trim(),
        email: normalizedEmail,
        role: role || 'Student',
        department: department || 'Computer Science & Engineering',
        phone: phone || '+91 (555) 019-2834'
      };
      const token = generateToken(fallbackUser);
      return res.status(201).json({
        success: true,
        token,
        user: fallbackUser
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide institutional email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = null;

    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({ email: normalizedEmail });
      } catch (dbErr) {
        console.warn('[Auth] Database lookup error:', dbErr.message);
      }
    }

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = generateToken(user);
        return res.json({
          success: true,
          token,
          user: {
            id: user._id.toString(),
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            profilePhoto: user.profilePhoto,
            phone: user.phone
          }
        });
      }
    }

    // Check built-in demo credentials
    const demoUser = DEMO_USERS.find(u => u.email === normalizedEmail);
    if (demoUser && (password === 'password123' || password === 'admin123' || password === 'demo123')) {
      // If DB is connected, save demo user to DB for future queries
      if (mongoose.connection.readyState === 1 && !user) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash('password123', salt);
          await User.create({
            name: demoUser.name,
            email: demoUser.email,
            password: hashedPassword,
            role: demoUser.role,
            department: demoUser.department,
            profilePhoto: demoUser.profilePhoto,
            phone: demoUser.phone
          });
        } catch (seedErr) {}
      }

      const token = generateToken(demoUser);
      return res.json({
        success: true,
        token,
        user: {
          id: demoUser._id,
          _id: demoUser._id,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
          department: demoUser.department,
          profilePhoto: demoUser.profilePhoto,
          phone: demoUser.phone
        }
      });
    }

    return res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials. For quick demo, sign in with admin@campus.edu / password123' 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Authentication error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(req.user.id).select('-password');
    }

    if (!user) {
      const demoUser = DEMO_USERS.find(u => u.email === req.user.email) || req.user;
      return res.json({
        success: true,
        user: {
          id: demoUser._id || demoUser.id,
          _id: demoUser._id || demoUser.id,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
          department: demoUser.department,
          profilePhoto: demoUser.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
          phone: demoUser.phone || '+91 (555) 019-2834',
          favoriteLocations: demoUser.favoriteLocations || []
        }
      });
    }

    return res.json({
      success: true,
      user: {
        id: user._id.toString(),
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        profilePhoto: user.profilePhoto,
        phone: user.phone,
        favoriteLocations: user.favoriteLocations
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
