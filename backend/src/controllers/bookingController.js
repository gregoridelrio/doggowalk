const Booking = require('../models/Booking');
const WalkerProfile = require('../models/WalkerProfile');

const createBooking = async (req, res) => {
  try {
    const { walkerId, dogId, date } = req.body;
    const bookingDate = new Date(date);

    const walkerProfile = await WalkerProfile.findOne({ walker: walkerId });
    if (!walkerProfile) {
      return res.status(404).json({ message: 'Walker not found' });
    }

    const isAvailable = walkerProfile.availableDays.some(
      (d) => new Date(d).toDateString() === bookingDate.toDateString()
    );
    if (!isAvailable) {
      return res.status(400).json({ message: 'Walker not available on this date' });
    }

    const booking = await Booking.create({
      client: req.user.id,
      walker: walkerId,
      dog: dogId,
      date: bookingDate,
      status: 'active',
    });

    walkerProfile.availableDays = walkerProfile.availableDays.filter(
      (d) => new Date(d).toDateString() !== bookingDate.toDateString()
    );
    await walkerProfile.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ client: req.user.id })
      .populate('walker', 'name email')
      .populate('dog', 'name breed');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();

    const walkerProfile = await WalkerProfile.findOne({ walker: booking.walker });
    if (walkerProfile) {
      walkerProfile.availableDays.push(booking.date);
      await walkerProfile.save();
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createBooking, getMyBookings, cancelBooking };