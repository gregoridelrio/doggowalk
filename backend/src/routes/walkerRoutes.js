const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const { createOrUpdateProfile, getAllWalkers, getWalkerCalendar } = require('../controllers/walkerController');

router.put('/profile', authenticate, createOrUpdateProfile);
router.get('/', getAllWalkers);
router.get('/:id/calendar', getWalkerCalendar);

module.exports = router;