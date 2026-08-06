const express = require('express');
const router = express.Router();
const { getAllRooms, getRoomById, createRoom, updateRoomOccupancy } = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.post('/', protect, authorize('Administrator', 'Faculty'), createRoom);
router.patch('/:id/occupancy', protect, updateRoomOccupancy);

module.exports = router;
