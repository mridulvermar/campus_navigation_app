const express = require('express');
const router = express.Router();
const { getAllUsers, updateProfile, updateUserRole } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('Administrator'), getAllUsers);
router.put('/profile', protect, updateProfile);
router.patch('/:id/role', protect, authorize('Administrator'), updateUserRole);

module.exports = router;
