const NavigationHistory = require('../models/NavigationHistory');
const Event = require('../models/Event');
const LostFound = require('../models/LostFound');

// Navigation History
exports.logNavigation = async (req, res) => {
  try {
    const { source, destination, distance, timeTaken, mode } = req.body;
    const history = await NavigationHistory.create({
      user: req.user.id,
      source,
      destination,
      distance,
      timeTaken,
      mode: mode || 'Walking'
    });
    res.status(201).json({ success: true, data: history });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getNavigationHistory = async (req, res) => {
  try {
    const history = await NavigationHistory.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(15);
    res.json({ success: true, count: history.length, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Lost and Found
exports.getLostFoundItems = async (req, res) => {
  try {
    const items = await LostFound.find().sort({ createdAt: -1 }).populate('postedBy', 'name email');
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createLostFoundItem = async (req, res) => {
  try {
    const item = await LostFound.create({
      ...req.body,
      postedBy: req.user.id
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
