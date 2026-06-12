const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const { createDog, getMyDogs } = require('../controllers/dogController');

router.post('/', authenticate, createDog);
router.get('/me', authenticate, getMyDogs);

module.exports = router;