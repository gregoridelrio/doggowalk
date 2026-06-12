const mongoose = require('mongoose');

const walkerProfileSchema = new mongoose.Schema(
  {
    walker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    pricePerWalk: { type: Number, required: true },
    availableDays: [{ type: Date }],
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('WalkerProfile', walkerProfileSchema);