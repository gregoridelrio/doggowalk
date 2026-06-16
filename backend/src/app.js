require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const dogRoutes = require('./routes/dogRoutes');
const walkerRoutes = require('./routes/walkerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/dogs', dogRoutes);
app.use('/api/walkers', walkerRoutes);
app.use('/api/bookings', bookingRoutes);

module.exports = app;