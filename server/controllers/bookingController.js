const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

exports.getAllBookings = async (req, res) => {
  try {
    const { all, date } = req.query;
    const todayStr = new Date().toISOString().split('T')[0];
    
    // By default, admin sees current day's active bookings (1-day history window)
    let query = {};
    if (date) {
      query.date = date;
    } else if (!all || all === 'false') {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      query = {
        $or: [
          { date: todayStr },
          { createdAt: { $gte: oneDayAgo } }
        ]
      };
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email role department')
      .populate('asset', 'assetName category location')
      .populate({ path: 'room', populate: { path: 'building', select: 'name code category' } })
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings, filter: date || (all ? 'all' : 'today_1day') });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('asset', 'assetName category location image')
      .populate({ path: 'room', populate: { path: 'building', select: 'name code category' } })
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { asset, room, bookingType, date, startTime, endTime, durationHours, purpose } = req.body;
    
    const qrCodeData = `CAMPUS-BOOKING-${Date.now()}-${req.user.id ? req.user.id.slice(-4) : 'USER'}`;

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

    const populatedBooking = await Booking.findById(booking._id)
      .populate('asset', 'assetName category location image')
      .populate({ path: 'room', populate: { path: 'building', select: 'name code category' } });

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

    res.status(201).json({ success: true, data: populatedBooking });
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
