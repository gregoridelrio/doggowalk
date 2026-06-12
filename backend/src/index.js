require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT  = process.env.PORT;

connectDB();

app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: '🐕 DoggoWalk API running' });
});

app.listen(PORT , () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});