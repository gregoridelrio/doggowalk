const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    breed: { type: String, required: true, trim: true },
    size: { type: String, enum: ['small', 'medium', 'large'], required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Dog', dogSchema);