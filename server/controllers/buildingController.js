const Building = require('../models/Building');

exports.getAllBuildings = async (req, res) => {
  try {
    const buildings = await Building.find();
    res.json({ success: true, count: buildings.length, data: buildings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBuildingById = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);
    if (!building) return res.status(404).json({ success: false, message: 'Building not found' });
    res.json({ success: true, data: building });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBuilding = async (req, res) => {
  try {
    const building = await Building.create(req.body);
    res.status(201).json({ success: true, data: building });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateBuilding = async (req, res) => {
  try {
    const building = await Building.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!building) return res.status(404).json({ success: false, message: 'Building not found' });
    res.json({ success: true, data: building });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteBuilding = async (req, res) => {
  try {
    const building = await Building.findByIdAndDelete(req.params.id);
    if (!building) return res.status(404).json({ success: false, message: 'Building not found' });
    res.json({ success: true, message: 'Building deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
