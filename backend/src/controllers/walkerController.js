const WalkerProfile = require('../models/WalkerProfile');

const createOrUpdateProfile = async (req, res) => {
  try {
    const { pricePerWalk, availableDays } = req.body;

    const profile = await WalkerProfile.findOneAndUpdate(
      { walker: req.user.id },
      { pricePerWalk, availableDays },
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllWalkers = async (req, res) => {
  try {
    const walkers = await WalkerProfile.find().populate('walker', 'name email');
    res.json(walkers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getWalkerCalendar = async (req, res) => {
  try {
    const profile = await WalkerProfile.findOne({ walker: req.params.id });
    if (!profile) {
      return res.status(404).json({ message: 'Walker not found' });
    }
    res.json({ availableDays: profile.availableDays, pricePerWalk: profile.pricePerWalk });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createOrUpdateProfile, getAllWalkers, getWalkerCalendar };