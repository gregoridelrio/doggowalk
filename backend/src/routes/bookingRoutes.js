const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const { createBooking, getMyBookings, cancelBooking } = require('../controllers/bookingController');
const validate = require('../middleware/validate');
const { bookingSchema } = require('../validations/bookingValidation');

router.post('/', authenticate, validate(bookingSchema), createBooking);
router.get('/me', authenticate, getMyBookings);
router.patch('/:id/cancel', authenticate, cancelBooking);

module.exports = router;