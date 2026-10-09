const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

exports.getAllBookings = async (req, res) => {
  try {
    const { all, date } = req.query;
    const todayStr = new Date().toISOString().split('T')[0];
    
    // By default, admin sees ALL Pending requests (always needs approval!) PLUS 1-day active window
    let query = {};
    if (date) {
      query.date = date;
    } else if (!all || all === 'false') {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      query = {
        $or: [
          { status: 'Pending' },
          { status: 'pending_approval' },
          { date: todayStr },
          { date: 'Today' },
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
    const rawRoomId = room?._id || (typeof room === 'string' ? room : null);
    const rawAssetId = asset?._id || (typeof asset === 'string' ? asset : null);

    const roomId = rawRoomId && mongoose.Types.ObjectId.isValid(rawRoomId) ? rawRoomId : null;
    const assetId = rawAssetId && mongoose.Types.ObjectId.isValid(rawAssetId) ? rawAssetId : null;

    const qrCodeData = `CAMPUS-BOOKING-${Date.now()}-${req.user?.id ? String(req.user.id).slice(-4) : 'USER'}`;

    const booking = await Booking.create({
      user: req.user?.id || req.user?._id,
      asset: assetId,
      room: roomId,
      bookingType: bookingType === 'Asset' ? 'Asset' : 'Facility',
      date: date || 'Today',
      startTime: startTime || '09:00 AM',
      endTime: endTime || '11:00 AM',
      durationHours: durationHours || 2,
      purpose: purpose || 'Academic Class Session',
      qrCodeData,
      status: 'Pending'
    });

    let populatedBooking = await Booking.findById(booking._id)
      .populate('asset', 'assetName category location image')
      .populate({ path: 'room', populate: { path: 'building', select: 'name code category' } });

    // If room wasn't an ObjectId in MongoDB, attach room metadata for response
    if (!populatedBooking.room && room) {
      populatedBooking = populatedBooking.toObject();
      populatedBooking.room = typeof room === 'object' ? room : { _id: room, name: 'Classroom' };
    }

    // Notify User
    if (req.user?.id) {
      await Notification.create({
        user: req.user.id,
        title: 'Booking Request Submitted',
        message: `Your reservation request for ${date} (${startTime}-${endTime}) has been logged and is awaiting admin approval.`,
        type: 'booking'
      }).catch(() => {});
    }

    if (req.io) {
      req.io.emit('new_booking_request', { bookingId: booking._id, userId: req.user?.id });
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
    if (booking.user?._id) {
      await Notification.create({
        user: booking.user._id,
        title: `Booking Request ${status}`,
        message: `Your reservation request for ${booking.date} has been ${status.toLowerCase()}.${adminComment ? ` Note: ${adminComment}` : ''}`,
        type: 'booking'
      }).catch(() => {});
    }

    if (req.io) {
      req.io.emit('booking_status_change', { bookingId: booking._id, status, userId: booking.user?._id });
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
