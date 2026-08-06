const Asset = require('../models/Asset');

exports.getAllAssets = async (req, res) => {
  try {
    const assets = await Asset.find().populate('building', 'name code');
    res.json({ success: true, count: assets.length, data: assets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id).populate('building');
    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found' });
    res.json({ success: true, data: asset });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAsset = async (req, res) => {
  try {
    const asset = await Asset.create(req.body);
    res.status(201).json({ success: true, data: asset });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateAssetStatus = async (req, res) => {
  try {
    const { status, availability } = req.body;
    const asset = await Asset.findByIdAndUpdate(req.params.id, { status, availability }, { new: true });
    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found' });
    res.json({ success: true, data: asset });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
