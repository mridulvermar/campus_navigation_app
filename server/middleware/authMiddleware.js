const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    if (!token || token === 'null' || token === 'undefined' || token === 'mock_jwt_token_2026' || token === 'demo_token_2026') {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_campus_jwt_key_2026_antigravity');
      
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      req.user = {
        id: user._id.toString(),
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      };
      return next();
    } catch (error) {
      const isExpired = error.name === 'TokenExpiredError';
      return res.status(401).json({ 
        success: false, 
        message: isExpired ? 'Token expired, please sign in again' : 'Not authorized, token verification failed' 
      });
    }
  }

  return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `User role '${req.user ? req.user.role : 'Guest'}' is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };

