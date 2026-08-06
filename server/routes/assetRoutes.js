const express = require('express');
const router = express.Router();
const { getAllAssets, getAssetById, createAsset, updateAssetStatus } = require('../controllers/assetController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllAssets);
router.get('/:id', getAssetById);
router.post('/', protect, authorize('Administrator', 'Faculty'), createAsset);
router.patch('/:id/status', protect, updateAssetStatus);

module.exports = router;
