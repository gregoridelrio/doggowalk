const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    walker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dog: { type: mongoose.Schema.Types.ObjectId, ref: 'Dog', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Booking', bookingSchema);