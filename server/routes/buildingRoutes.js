const express = require('express');
const router = express.Router();
const { getAllBuildings, getBuildingById, createBuilding, updateBuilding, deleteBuilding } = require('../controllers/buildingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllBuildings);
router.get('/:id', getBuildingById);
router.post('/', protect, authorize('Administrator'), createBuilding);
router.put('/:id', protect, authorize('Administrator'), updateBuilding);
router.delete('/:id', protect, authorize('Administrator'), deleteBuilding);

module.exports = router;
