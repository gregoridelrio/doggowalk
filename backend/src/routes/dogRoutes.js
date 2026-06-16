const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const { createDog, getMyDogs } = require('../controllers/dogController');
const validate = require('../middleware/validate');
const { dogSchema } = require('../validations/dogValidation');

router.post('/', authenticate, validate(dogSchema), createDog);
router.get('/me', authenticate, getMyDogs);

module.exports = router;