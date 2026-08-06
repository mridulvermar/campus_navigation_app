const express = require('express');
const router = express.Router();
const { getUserNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getUserNotifications);
router.patch('/:id/read', protect, markAsRead);
router.post('/read-all', protect, markAllAsRead);

module.exports = router;
