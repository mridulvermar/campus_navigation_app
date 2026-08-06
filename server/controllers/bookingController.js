const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email role department')
      .populate('asset', 'assetName category location')
      .populate('room', 'roomNumber category capacity')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('asset', 'assetName category location image')
      .populate('room', 'roomNumber category capacity')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { asset, room, bookingType, date, startTime, endTime, durationHours, purpose } = req.body;
    
    const qrCodeData = `CAMPUS-BOOKING-${Date.now()}-${req.user.id.slice(-4)}`;

    const booking = await Booking.create({
      user: req.user.id,
      asset: asset || null,
      room: room || null,
      bookingType: bookingType || (asset ? 'Asset' : 'Facility'),
      date,
      startTime,
      endTime,
      durationHours: durationHours || 1,
      purpose,
      qrCodeData,
      status: 'Pending'
    });

    // Notify User
    await Notification.create({
      user: req.user.id,
      title: 'Booking Request Submitted',
      message: `Your reservation request for ${date} (${startTime}-${endTime}) has been logged and is awaiting approval.`,
      type: 'booking'
    });

    if (req.io) {
      req.io.emit('new_booking_request', { bookingId: booking._id, userId: req.user.id });
    }

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, adminComment } = req.body;
    const booking = await Booking.findById(req.params.id).populate('user');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.status = status;
    if (adminComment) booking.adminComment = adminComment;
    await booking.save();

    // Create notification for student/faculty
    await Notification.create({
      user: booking.user._id,
      title: `Booking Request ${status}`,
      message: `Your reservation request for ${booking.date} has been ${status.toLowerCase()}.${adminComment ? ` Note: ${adminComment}` : ''}`,
      type: 'booking'
    });

    if (req.io) {
      req.io.emit('booking_status_change', { bookingId: booking._id, status, userId: booking.user._id });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.checkInBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.checkedIn = true;
    booking.status = 'Completed';
    await booking.save();

    res.json({ success: true, message: 'Successfully checked in via QR Code', data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
