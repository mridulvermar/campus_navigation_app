const express = require('express');
const router = express.Router();
const { 
  logNavigation, 
  getNavigationHistory, 
  getEvents, 
  createEvent, 
  getLostFoundItems, 
  createLostFoundItem 
} = require('../controllers/extraController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/navigation-history', protect, logNavigation);
router.get('/navigation-history', protect, getNavigationHistory);

router.get('/events', getEvents);
router.post('/events', protect, authorize('Administrator', 'Faculty'), createEvent);

router.get('/lost-found', getLostFoundItems);
router.post('/lost-found', protect, createLostFoundItem);

module.exports = router;
