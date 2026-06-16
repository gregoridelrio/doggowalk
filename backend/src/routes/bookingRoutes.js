const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const { createBooking, getMyBookings, cancelBooking } = require('../controllers/bookingController');

router.post('/', authenticate, createBooking);
router.get('/me', authenticate, getMyBookings);
router.patch('/:id/cancel', authenticate, cancelBooking);

module.exports = router;