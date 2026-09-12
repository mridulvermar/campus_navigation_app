require('dotenv').config();
const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const buildingRoutes = require('./routes/buildingRoutes');
const roomRoutes = require('./routes/roomRoutes');
const assetRoutes = require('./routes/assetRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');
const extraRoutes = require('./routes/extraRoutes');
const ragRoutes = require('./routes/ragRoutes');

const app = express();
const server = http.createServer(app);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  }
});

// Attach Socket.IO to Request Object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect Database
connectDB();

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'Multi-Modal Campus Navigation Ecosystem API',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/extra', extraRoutes);
app.use('/api/rag', ragRoutes);
app.use('/api/chat', ragRoutes);

// Database fallback for offline Mongoose
app.use((err, req, res, next) => {
  if (err && (err.name === 'MongooseError' || err.name === 'MongoNetworkError' || (err.message && err.message.includes('buffering timed out')))) {
    console.warn('[AI Studio] Database offline — returning fallback');
    if (req.method === 'GET') {
      return res.json({ success: true, data: req.path.endsWith('s') ? [] : {} });
    }
    return res.status(503).json({ success: false, message: 'Database temporarily unavailable' });
  }
  next(err);
});

// Serve frontend static build
const clientDistPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) next();
  });
});

// Global Error Handler
app.use(errorHandler);

// Socket.IO Real-time Events Handling & Spatial Simulation
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  // Spatial location simulation emission
  const locationInterval = setInterval(() => {
    // Slight simulated GPS jitter around BIT campus for spatial localization
    const simulatedLocation = {
      latitude: 11.4960 + (Math.random() - 0.5) * 0.002,
      longitude: 77.2765 + (Math.random() - 0.5) * 0.002,
      accuracyMeters: Math.floor(Math.random() * 5) + 3,
      timestamp: Date.now()
    };
    socket.emit('spatial_location_pulse', simulatedLocation);
  }, 4000);

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    clearInterval(locationInterval);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 [Server] Campus Platform running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

