exports.getAnalyticsData = async (req, res) => {
  try {
    const analytics = {
      dailyVisitors: [
        { day: 'Mon', count: 1420 },
        { day: 'Tue', count: 1850 },
        { day: 'Wed', count: 2100 },
        { day: 'Thu', count: 1980 },
        { day: 'Fri', count: 2450 },
        { day: 'Sat', count: 890 },
        { day: 'Sun', count: 620 }
      ],
      popularBuildings: [
        { name: 'Science Block A', usage: 88, color: '#3B82F6' },
        { name: 'Main Library', usage: 94, color: '#10B981' },
        { name: 'Engineering Quad', usage: 76, color: '#8B5CF6' },
        { name: 'Student Union', usage: 65, color: '#F59E0B' },
        { name: 'Innovation Hub', usage: 91, color: '#EC4899' }
      ],
      peakHours: [
        { hour: '08:00', occupancy: 20 },
        { hour: '10:00', occupancy: 65 },
        { hour: '12:00', occupancy: 92 },
        { hour: '14:00', occupancy: 88 },
        { hour: '16:00', occupancy: 70 },
        { hour: '18:00', occupancy: 45 },
        { hour: '20:00', occupancy: 25 }
      ],
      mostReservedAssets: [
        { asset: 'MacBook Pro M3 Lab Kit', count: 142 },
        { asset: '4K Cinema Projector', count: 98 },
        { asset: 'Meta Quest 3 VR Suite', count: 84 },
        { asset: 'Ender 3D Printer Station', count: 76 },
        { asset: 'DJI Mavic Drone', count: 52 }
      ],
      departmentUsage: [
        { dept: 'Computer Science', percentage: 38 },
        { dept: 'Electrical Engineering', percentage: 24 },
        { dept: 'Mechanical Eng.', percentage: 18 },
        { dept: 'Architecture & Design', percentage: 12 },
        { dept: 'Business & Management', percentage: 8 }
      ],
      summaryStats: {
        totalCampusOccupancyPercent: 78,
        activeBookingsToday: 42,
        availableRoomsCount: 18,
        availableAssetsCount: 35,
        totalNavigationsToday: 312
      }
    };

    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
