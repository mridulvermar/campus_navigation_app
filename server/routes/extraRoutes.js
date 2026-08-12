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

// Geolocations Routes
const { getGeolocationLocations, searchGeolocations, getGeoBitsLocations, searchGeoBits } = require('../controllers/extraController');
router.get('/geolocations/locations', getGeolocationLocations);
router.get('/geolocations/search', searchGeolocations);
router.get('/geobits/locations', getGeoBitsLocations);
router.get('/geobits/search', searchGeoBits);

module.exports = router;
