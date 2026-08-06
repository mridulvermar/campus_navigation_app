export const MOCK_BUILDINGS = [
  {
    _id: 'b1',
    name: 'Science & Innovation Block A',
    code: 'SCI-A',
    description: 'Advanced Research Laboratories, Physics cleanrooms, Robotics labs, and Spatial AI testing centers.',
    latitude: 37.774929,
    longitude: -122.419416,
    floorCount: 5,
    category: 'Research',
    openingHours: '07:00 AM - 11:00 PM',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
    amenities: ['High-Speed WiFi', '3D Printing Lab', 'Cleanroom', 'Elevator', 'Cafe'],
    emergencyExits: [
      { floor: 1, locationName: 'North Ground Exit (Fire Hose Access)' },
      { floor: 2, locationName: 'East Stairwell Emergency Exit' }
    ]
  },
  {
    _id: 'b2',
    name: 'Main Central Library',
    code: 'LIB-CENTRAL',
    description: 'Multi-story quiet study library with digital archives, seminar rooms, and private study pods.',
    latitude: 37.775800,
    longitude: -122.418200,
    floorCount: 4,
    category: 'Library',
    openingHours: '06:00 AM - 12:00 AM',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
    amenities: ['Silent Zones', 'Group Study Rooms', 'Coffee Lounge', 'Book Scanner'],
    emergencyExits: [
      { floor: 1, locationName: 'Main Foyer South Exit' }
    ]
  },
  {
    _id: 'b3',
    name: 'Engineering Quadrangle B',
    code: 'ENG-B',
    description: 'Department of Computer Science & Electrical Engineering. Features computer centers and lecture halls.',
    latitude: 37.773800,
    longitude: -122.421000,
    floorCount: 6,
    category: 'Academic',
    openingHours: '07:30 AM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=800',
    amenities: ['Computer Labs', 'VR Studio', 'Vending Machines', 'Restrooms'],
    emergencyExits: [
      { floor: 1, locationName: 'West Plaza Exit' }
    ]
  },
  {
    _id: 'b4',
    name: 'Student Activity & Union Center',
    code: 'SAU-1',
    description: 'Hub for student clubs, recreational sports, event halls, cafeteria, and administrative services.',
    latitude: 37.776200,
    longitude: -122.420500,
    floorCount: 3,
    category: 'Dining',
    openingHours: '08:00 AM - 10:00 PM',
    image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=800',
    amenities: ['Food Court', 'ATM', 'Student Lounge', 'Auditorium'],
    emergencyExits: [
      { floor: 1, locationName: 'South Court Exit' }
    ]
  },
  {
    _id: 'b5',
    name: 'Grand Campus Auditorium',
    code: 'AUD-GRAND',
    description: '1,200 seat modern auditorium equipped with surround sound and high-definition laser projectors.',
    latitude: 37.772900,
    longitude: -122.417500,
    floorCount: 2,
    category: 'Auditorium',
    openingHours: '08:00 AM - 09:00 PM',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
    amenities: ['Acoustic Panels', 'Stage Lighting', 'Green Rooms', 'VIP Lounge'],
    emergencyExits: [
      { floor: 1, locationName: 'Main Lobby Doors' },
      { floor: 1, locationName: 'Backstage Fire Door' }
    ]
  }
];

export const MOCK_ROOMS = [
  {
    _id: 'r1',
    roomNumber: 'A-301 Smart Classroom',
    building: { _id: 'b1', name: 'Science & Innovation Block A', code: 'SCI-A' },
    floor: 3,
    capacity: 45,
    availability: true,
    currentOccupancy: 12,
    category: 'Classroom',
    facilities: ['Smart Board', 'Dual 4K Projectors', 'HVAC Control', 'Power Outlets']
  },
  {
    _id: 'r2',
    roomNumber: 'A-102 Nanotech Clean Lab',
    building: { _id: 'b1', name: 'Science & Innovation Block A', code: 'SCI-A' },
    floor: 1,
    capacity: 20,
    availability: true,
    currentOccupancy: 18,
    category: 'Labs',
    facilities: ['Fume Hoods', '3D Printers', 'Atomic Microscopes', 'Safety Shower']
  },
  {
    _id: 'r3',
    roomNumber: 'Seminar Pod 204',
    building: { _id: 'b2', name: 'Main Central Library', code: 'LIB-CENTRAL' },
    floor: 2,
    capacity: 60,
    availability: true,
    currentOccupancy: 35,
    category: 'Seminar Hall',
    facilities: ['Video Conferencing', 'Dual Displays', 'Mic Array']
  },
  {
    _id: 'r4',
    roomNumber: 'Main Stage Auditorium',
    building: { _id: 'b5', name: 'Grand Campus Auditorium', code: 'AUD-GRAND' },
    floor: 1,
    capacity: 1200,
    availability: false,
    currentOccupancy: 850,
    category: 'Auditorium',
    facilities: ['Dolby Atmos', 'Laser Projector', 'Stage Lighting']
  },
  {
    _id: 'r5',
    roomNumber: 'Outdoor Turf Arena 1',
    building: { _id: 'b4', name: 'Student Activity & Union Center', code: 'SAU-1' },
    floor: 1,
    capacity: 200,
    availability: true,
    currentOccupancy: 40,
    category: 'Sports Ground',
    facilities: ['Floodlights', 'Seating Stands', 'Equipment Shed']
  }
];

export const MOCK_ASSETS = [
  {
    _id: 'ast1',
    assetName: 'Apple MacBook Pro M3 Max Lab Unit',
    category: 'Electronics',
    status: 'Available',
    location: 'Computer Center Floor 2, Room B-204',
    building: { name: 'Engineering Quad B' },
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600',
    availability: true,
    serialNumber: 'SN-MAC-2026-001'
  },
  {
    _id: 'ast2',
    assetName: 'Meta Quest 3 VR Development Headset',
    category: 'VR Headset',
    status: 'Available',
    location: 'Innovation Lab A-102',
    building: { name: 'Science & Innovation Block A' },
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?auto=format&fit=crop&q=80&w=600',
    availability: true,
    serialNumber: 'SN-VRQ3-2026-882'
  },
  {
    _id: 'ast3',
    assetName: 'DJI Mavic 3 Pro Survey Drone',
    category: 'Drone',
    status: 'Reserved',
    location: 'GIS Spatial Analytics Center',
    building: { name: 'Science & Innovation Block A' },
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=600',
    availability: false,
    serialNumber: 'SN-DJI-DRONE-991'
  },
  {
    _id: 'ast4',
    assetName: 'Ender 3 Pro High-Precision 3D Printer',
    category: '3D Printer',
    status: 'Available',
    location: 'Maker Studio B-105',
    building: { name: 'Engineering Quad B' },
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    availability: true,
    serialNumber: 'SN-3DP-2026-302'
  },
  {
    _id: 'ast5',
    assetName: 'Epson 4K Laser Cinema Projector Unit',
    category: 'Projector',
    status: 'In Use',
    location: 'Seminar Pod 204',
    building: { name: 'Main Central Library' },
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600',
    availability: false,
    serialNumber: 'SN-PRJ-2026-092'
  }
];

export const MOCK_BOOKINGS = [
  {
    _id: 'bk1',
    user: { name: 'Alex Johnson', email: 'student@campus.edu', department: 'Computer Science' },
    asset: { assetName: 'Apple MacBook Pro M3 Max Lab Unit', category: 'Electronics' },
    bookingType: 'Asset',
    date: '2026-08-06',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    durationHours: 2,
    purpose: 'Capstone Project Machine Learning Model Training',
    status: 'Approved',
    qrCodeData: 'CAMPUS-BOOKING-9912-STU1',
    checkedIn: true
  },
  {
    _id: 'bk2',
    user: { name: 'Dr. Sarah Vance', email: 'faculty@campus.edu', department: 'Electrical Engineering' },
    room: { roomNumber: 'Seminar Pod 204', category: 'Seminar Hall' },
    bookingType: 'Facility',
    date: '2026-08-07',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    durationHours: 2,
    purpose: 'Faculty Spatial Robotics Research Presentation',
    status: 'Pending',
    qrCodeData: 'CAMPUS-BOOKING-8821-FAC1',
    checkedIn: false
  },
  {
    _id: 'bk3',
    user: { name: 'Michael Chen', email: 'mchen@campus.edu', department: 'Architecture' },
    asset: { assetName: 'Meta Quest 3 VR Development Headset', category: 'VR Headset' },
    bookingType: 'Asset',
    date: '2026-08-08',
    startTime: '11:00 AM',
    endTime: '01:00 PM',
    durationHours: 2,
    purpose: 'Virtual Reality Spatial Building Walkthrough',
    status: 'Approved',
    qrCodeData: 'CAMPUS-BOOKING-7711-ARCH',
    checkedIn: false
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    _id: 'n1',
    title: 'Booking Approved',
    message: 'Your reservation for Apple MacBook Pro M3 Max Lab Unit on 2026-08-06 has been approved by Admin.',
    read: false,
    type: 'booking',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'n2',
    title: 'Spatial System Maintenance',
    message: 'Campus IoT spatial localization sensors in Science Block A will undergo maintenance at 11:00 PM.',
    read: true,
    type: 'system',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: 'n3',
    title: 'Asset Availability Alert',
    message: 'DJI Mavic 3 Pro Survey Drone is now marked as available for faculty reservation.',
    read: false,
    type: 'reminder',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  }
];

export const MOCK_ANALYTICS = {
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
    { name: 'Science Block A', usage: 88, color: '#06B6D4' },
    { name: 'Main Library', usage: 94, color: '#10B981' },
    { name: 'Engineering Quad', usage: 76, color: '#6366F1' },
    { name: 'Student Union', usage: 65, color: '#F59E0B' },
    { name: 'Grand Auditorium', usage: 91, color: '#EC4899' }
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
    { asset: 'MacBook Pro M3 Kit', count: 142 },
    { asset: '4K Laser Projector', count: 98 },
    { asset: 'Meta Quest 3 VR', count: 84 },
    { asset: '3D Printer Station', count: 76 },
    { asset: 'DJI Mavic Drone', count: 52 }
  ],
  departmentUsage: [
    { dept: 'Computer Science', percentage: 38 },
    { dept: 'Electrical Eng.', percentage: 24 },
    { dept: 'Mechanical Eng.', percentage: 18 },
    { dept: 'Architecture', percentage: 12 },
    { dept: 'Business', percentage: 8 }
  ],
  summaryStats: {
    totalCampusOccupancyPercent: 78,
    activeBookingsToday: 42,
    availableRoomsCount: 18,
    availableAssetsCount: 35,
    totalNavigationsToday: 312
  }
};
