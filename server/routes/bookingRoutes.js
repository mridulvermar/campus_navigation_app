const express = require('express');
const router = express.Router();
const { getAllBookings, getUserBookings, createBooking, updateBookingStatus, checkInBooking } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('Administrator'), getAllBookings);
router.get('/my', protect, getUserBookings);
router.post('/', protect, createBooking);
router.patch('/:id/status', protect, authorize('Administrator'), updateBookingStatus);
router.post('/:id/checkin', protect, checkInBooking);

module.exports = router;
