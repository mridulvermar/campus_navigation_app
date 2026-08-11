const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Building = require('../models/Building');
const Room = require('../models/Room');
const Asset = require('../models/Asset');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const LostFound = require('../models/LostFound');
const Notification = require('../models/Notification');

const seedDatabase = async () => {
  try {
    console.log('[Seed] Clearing existing database collections...');
    await User.deleteMany({});
    await Building.deleteMany({});
    await Room.deleteMany({});
    await Asset.deleteMany({});
    await Booking.deleteMany({});
    await Event.deleteMany({});
    await LostFound.deleteMany({});
    await Notification.deleteMany({});

    console.log('[Seed] Inserting seed Users...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      {
        name: 'Alex Johnson',
        email: 'student@campus.edu',
        password: passwordHash,
        role: 'Student',
        department: 'Computer Science & Engineering',
        phone: '+1 (555) 019-2834',
        favoriteLocations: ['Science Block A', 'Main Library']
      },
      {
        name: 'Dr. Sarah Vance',
        email: 'faculty@campus.edu',
        password: passwordHash,
        role: 'Faculty',
        department: 'Electrical Engineering',
        phone: '+1 (555) 392-8102',
        favoriteLocations: ['Innovation Hub', 'Engineering Quad']
      },
      {
        name: 'Admin User',
        email: 'admin@campus.edu',
        password: passwordHash,
        role: 'Administrator',
        department: 'Campus IT & Administration',
        phone: '+1 (555) 998-1122',
        favoriteLocations: ['Administrative Complex', 'Main Library']
      }
    ]);

    const studentUser = users[0];
    const facultyUser = users[1];

    console.log('[Seed] Inserting seed Buildings...');
    const buildings = await Building.insertMany([
      {
        name: 'Guest House at Main Gate',
        code: 'GST-HOUSE',
        description: 'University VIP Guest House and Faculty Visitor Suites located near Main Gate.',
        latitude: 11.49985783747626,
        longitude: 77.2785586257753,
        floorCount: 2,
        category: 'Hostel',
        openingHours: '24/7 Service',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
        amenities: ['VIP Lounge', 'Dining Room', 'High-Speed WiFi', 'AC'],
        emergencyExits: [{ floor: 1, locationName: 'Main Entrance Exit' }]
      },
      {
        name: 'BIT Main Entrance Gate',
        code: 'BIT-GATE-A',
        description: 'Primary entrance gate for Bannari Amman Institute of Technology with security checkpost and transport hub.',
        latitude: 11.500344084434856,
        longitude: 77.27793367106331,
        floorCount: 1,
        category: 'Academic',
        openingHours: '24/7 Open',
        image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800',
        amenities: ['Security Post', 'Information Desk', 'Bus Stop'],
        emergencyExits: [{ floor: 1, locationName: 'Gate A Access' }]
      },
      {
        name: 'BIT Main Vehicle Parking',
        code: 'BIT-PRK',
        description: 'Central parking lot for student, faculty, and visitor two-wheelers and four-wheelers.',
        latitude: 11.49839383481472,
        longitude: 77.27822871405188,
        floorCount: 1,
        category: 'Academic',
        openingHours: '06:00 AM - 10:00 PM',
        image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=800',
        amenities: ['Shaded Bays', 'EV Chargers', 'Security Camera'],
        emergencyExits: [{ floor: 1, locationName: 'Parking East Gate' }]
      },
      {
        name: 'Aeronautical Engineering Block',
        code: 'AERO-BLK',
        description: 'Department of Aeronautical Engineering featuring wind tunnel labs, flight simulators, and propulsion centers.',
        latitude: 11.497687817276743,
        longitude: 77.27823966797872,
        floorCount: 4,
        category: 'Academic',
        openingHours: '08:00 AM - 08:00 PM',
        image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800',
        amenities: ['Flight Simulators', 'Wind Tunnel Lab', 'CAD Workstations'],
        emergencyExits: [{ floor: 1, locationName: 'Aero North Exit' }]
      },
      {
        name: 'SF Academic Block',
        code: 'SF-BLK',
        description: 'Self-Financing Academic Block housing Computer Science, IT, and AI innovation labs.',
        latitude: 11.496399919251377,
        longitude: 77.27864427637385,
        floorCount: 5,
        category: 'Academic',
        openingHours: '08:00 AM - 08:00 PM',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
        amenities: ['Computer Labs', 'Smart Classrooms', 'WiFi 6'],
        emergencyExits: [{ floor: 1, locationName: 'SF West Stairwell Exit' }]
      },
      {
        name: 'Mechanical Engineering Block',
        code: 'MECH-BLK',
        description: 'Department of Mechanical Engineering, CNC workshops, thermal engineering labs, and robotics centers.',
        latitude: 11.495788265277632,
        longitude: 77.27852290881292,
        floorCount: 4,
        category: 'Academic',
        openingHours: '08:00 AM - 08:00 PM',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
        amenities: ['CNC Machines', '3D Printers', 'Robotics Lab'],
        emergencyExits: [{ floor: 1, locationName: 'Mech Workshop Gate' }]
      },
      {
        name: 'Civil Store & Testing Lab',
        code: 'CIV-STORE',
        description: 'Civil engineering structural testing labs, concrete testing facilities, and surveying stores.',
        latitude: 11.494825473926202,
        longitude: 77.27852868822264,
        floorCount: 2,
        category: 'Research',
        openingHours: '08:30 AM - 06:00 PM',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800',
        amenities: ['UTM Machine', 'Soil Lab', 'Survey Equipment'],
        emergencyExits: [{ floor: 1, locationName: 'Civil Store Exit' }]
      },
      {
        name: 'BIT Boys Residential Hostel',
        code: 'BOYS-HST',
        description: 'Multi-story boys hostel complex with dining mess, study rooms, and indoor recreation.',
        latitude: 11.494168508528992,
        longitude: 77.27863271755821,
        floorCount: 6,
        category: 'Hostel',
        openingHours: '24/7 Resident Access',
        image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
        amenities: ['Dining Mess', 'Study Lounge', 'High-Speed Internet'],
        emergencyExits: [{ floor: 1, locationName: 'Boys Hostel Main Gate' }]
      },
      {
        name: 'BIT Power House',
        code: 'PWR-HOUSE',
        description: 'Central electrical power station, high-voltage transformers, and generator backup systems.',
        latitude: 11.493981612920583,
        longitude: 77.27847089414094,
        floorCount: 1,
        category: 'Research',
        openingHours: '24/7 Grid Operation',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800',
        amenities: ['High-Voltage Transformers', 'UPS Backup'],
        emergencyExits: [{ floor: 1, locationName: 'Power Substation Safety Exit' }]
      },
      {
        name: 'BIT Sports Arena',
        code: 'SPORTS-ARNA',
        description: 'Multi-sport outdoor arena containing synthetic tennis courts, basketball court, and volleyball court.',
        latitude: 11.493304823241411,
        longitude: 77.27824838695257,
        floorCount: 1,
        category: 'Sports',
        openingHours: '06:00 AM - 09:30 PM',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
        amenities: ['Floodlights', 'Tennis Court', 'Basketball Court', 'Volleyball Court'],
        emergencyExits: [{ floor: 1, locationName: 'Sports Complex Gate' }]
      },
      {
        name: 'Central Campus Cafeteria',
        code: 'BIT-CAF',
        description: 'Multi-cuisine campus dining hall, fresh juice bars, bakery, and student lounge.',
        latitude: 11.493777726666552,
        longitude: 77.27756930657576,
        floorCount: 2,
        category: 'Dining',
        openingHours: '07:00 AM - 09:30 PM',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
        amenities: ['Food Stalls', 'Coffee Kiosks', 'Outdoor Terrace'],
        emergencyExits: [{ floor: 1, locationName: 'Cafeteria Main Doors' }]
      },
      {
        name: 'AS Academic Block',
        code: 'AS-BLK',
        description: 'Applied Science Academic Block with smart classrooms starting from 101, 201.',
        latitude: 11.494400711990208,
        longitude: 77.27754040953792,
        floorCount: 4,
        category: 'Academic',
        openingHours: '08:00 AM - 07:30 PM',
        image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
        amenities: ['Smart Boards', 'Air Conditioning', 'Physics & Chemistry Labs'],
        emergencyExits: [{ floor: 1, locationName: 'AS Block East Exit' }]
      },
      {
        name: 'BIT Learning Center',
        code: 'LRN-CTR',
        description: 'Central library, digital archival repository, quiet study carrels, and e-learning pods.',
        latitude: 11.494199657787775,
        longitude: 77.27716185833827,
        floorCount: 4,
        category: 'Library',
        openingHours: '07:00 AM - 11:00 PM',
        image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
        amenities: ['E-Library Terminals', 'Silent Study Zones', 'Discussion Rooms'],
        emergencyExits: [{ floor: 1, locationName: 'Learning Center South Gate' }]
      },
      {
        name: 'IB Academic Block (Main Wing)',
        code: 'IB-BLK-MAIN',
        description: 'Institution Building Main Academic Block featuring lecture halls (Classes 101-117, 201-217).',
        latitude: 11.49430726428022,
        longitude: 77.2765290132251,
        floorCount: 4,
        category: 'Academic',
        openingHours: '08:00 AM - 08:00 PM',
        image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=800',
        amenities: ['Lecture Theatres', 'Smart Displays', 'Seminar Halls'],
        emergencyExits: [{ floor: 1, locationName: 'IB Main Lobby Exit' }]
      },
      {
        name: 'IB Academic Block (East Wing)',
        code: 'IB-BLK-EAST',
        description: 'Institution Building East Wing (Closest entrance for Classes 118-125 and 218-225).',
        latitude: 11.496901799450212,
        longitude: 77.27641863364026,
        floorCount: 4,
        category: 'Academic',
        openingHours: '08:00 AM - 08:00 PM',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
        amenities: ['Direct Entry Corridor', 'Smart Screens', 'Computer Labs'],
        emergencyExits: [{ floor: 1, locationName: 'IB East Entrance Exit' }]
      },
      {
        name: 'BIT Auditorium',
        code: 'BIT-AUD',
        description: 'Grand University Auditorium and Convention Hall for conferences, symposia, and cultural events.',
        latitude: 11.494975932732403,
        longitude: 77.27700648228333,
        floorCount: 2,
        category: 'Auditorium',
        openingHours: '08:00 AM - 09:30 PM',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
        amenities: ['Surround Sound', 'Stage Lighting', 'Green Rooms', 'Acoustic Panels'],
        emergencyExits: [{ floor: 1, locationName: 'Auditorium Main Lobby Doors' }]
      },
      {
        name: 'BIT Girls Residential Hostel',
        code: 'GIRLS-HST',
        description: 'Secure women residential hostel complex with dining hall, courtyard, and study rooms.',
        latitude: 11.4939702859126,
        longitude: 77.27582681521945,
        floorCount: 5,
        category: 'Hostel',
        openingHours: '24/7 Resident Access',
        image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=800',
        amenities: ['Dining Mess', 'Courtyard Garden', 'Visitor Lounge'],
        emergencyExits: [{ floor: 1, locationName: 'Girls Hostel Main Gate' }]
      },
      {
        name: 'BIT Medical Center',
        code: 'MED-CTR',
        description: '24/7 campus health clinic, ambulance service, outpatient consultation, and pharmacy.',
        latitude: 11.493859847537053,
        longitude: 77.2745929117139,
        floorCount: 2,
        category: 'Academic',
        openingHours: '24/7 Emergency Care',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
        amenities: ['24/7 Doctor On Call', 'Ambulance Bay', 'Pharmacy'],
        emergencyExits: [{ floor: 1, locationName: 'Medical Emergency Ramp' }]
      },
      {
        name: 'BIT Entrance Gate C',
        code: 'BIT-GATE-C',
        description: 'Campus Entrance Gate C for west entrance access.',
        latitude: 11.493922146110672,
        longitude: 77.27368554473709,
        floorCount: 1,
        category: 'Academic',
        openingHours: '06:00 AM - 10:00 PM',
        image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800',
        amenities: ['Security Post', 'Gate C Access'],
        emergencyExits: [{ floor: 1, locationName: 'Gate C Security Bay' }]
      },
      {
        name: 'BIT Cricket Ground',
        code: 'CRICKET-GND',
        description: 'Full-size cricket stadium with turf pitch, pavilion, and spectator seating.',
        latitude: 11.495332355670667,
        longitude: 77.27502925698974,
        floorCount: 1,
        category: 'Sports',
        openingHours: '06:00 AM - 07:00 PM',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
        amenities: ['Turf Pitch', 'Pavilion', 'Practice Nets'],
        emergencyExits: [{ floor: 1, locationName: 'Cricket Field Main Gate' }]
      },
      {
        name: 'BIT Handball Court',
        code: 'HANDBALL-CRT',
        description: 'Dedicated outdoor handball court facility.',
        latitude: 11.495694818030554,
        longitude: 77.27425481638504,
        floorCount: 1,
        category: 'Sports',
        openingHours: '06:00 AM - 08:30 PM',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
        amenities: ['Synthetic Court', 'Lighting'],
        emergencyExits: [{ floor: 1, locationName: 'Handball Gate' }]
      },
      {
        name: 'BIT Tennis Court',
        code: 'TENNIS-CRT',
        description: 'Synthetic surface tennis courts with evening floodlights.',
        latitude: 11.494751848571486,
        longitude: 77.2742056914201,
        floorCount: 1,
        category: 'Sports',
        openingHours: '06:00 AM - 08:30 PM',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
        amenities: ['Floodlights', 'Synthetic Surface'],
        emergencyExits: [{ floor: 1, locationName: 'Tennis Court Gate' }]
      },
      {
        name: 'BIT Athletic Track & Field',
        code: 'ATHLETIC-CRT',
        description: '400m synthetic running track and field sports arena.',
        latitude: 11.49696909606593,
        longitude: 77.27489633061376,
        floorCount: 1,
        category: 'Sports',
        openingHours: '05:30 AM - 09:00 PM',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
        amenities: ['400m Track', 'Long Jump Pit', 'High Jump Area'],
        emergencyExits: [{ floor: 1, locationName: 'Track Stadium North Gate' }]
      },
      {
        name: 'BIT Indoor Badminton Court',
        code: 'BADMINTON-CRT',
        description: 'Indoor wooden court facility for badminton matches.',
        latitude: 11.497832770120427,
        longitude: 77.27546560224901,
        floorCount: 1,
        category: 'Sports',
        openingHours: '06:00 AM - 09:30 PM',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
        amenities: ['Wooden Courts', 'AC', 'Locker Room'],
        emergencyExits: [{ floor: 1, locationName: 'Badminton Hall Gate' }]
      },
      {
        name: 'BIT Staff & Faculty Quarters',
        code: 'STAFF-QTRS',
        description: 'Residential quarters complex for faculty members, staff, and visiting scholars.',
        latitude: 11.498339646449223,
        longitude: 77.27562453595985,
        floorCount: 4,
        category: 'Hostel',
        openingHours: '24/7 Resident Access',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
        amenities: ['Park', 'Community Hall', 'Security Desk'],
        emergencyExits: [{ floor: 1, locationName: 'Quarters Gate' }]
      }
    ]);

    console.log('[Seed] Inserting seed Rooms...');
    const rooms = await Room.insertMany([
      // AS Block (Classes 101, 201...)
      {
        roomNumber: 'AS-101 Smart Classroom',
        building: buildings[11]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 25,
        category: 'Classroom',
        facilities: ['Smart Board', 'Dual 4K Projectors', 'Air Conditioning', 'Power Outlets']
      },
      {
        roomNumber: 'AS-102 Applied Sciences Lab',
        building: buildings[11]._id,
        floor: 1,
        capacity: 50,
        availability: true,
        currentOccupancy: 30,
        category: 'Labs',
        facilities: ['Physics Kits', 'Fume Hoods', 'Smart Screen', 'Safety Shower']
      },
      {
        roomNumber: 'AS-201 Interactive Lecture Hall',
        building: buildings[11]._id,
        floor: 2,
        capacity: 65,
        availability: true,
        currentOccupancy: 40,
        category: 'Classroom',
        facilities: ['Tiered Seating', 'Surround Sound', 'HD Projector', 'AC']
      },
      {
        roomNumber: 'AS-202 Seminar Room',
        building: buildings[11]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 15,
        category: 'Seminar Hall',
        facilities: ['Video Conferencing', 'Dual Displays', 'Mic Array']
      },

      // IB Block Main Wing (Classes 101-117, 201-217)
      {
        roomNumber: 'IB-101 Lecture Theatre',
        building: buildings[13]._id,
        floor: 1,
        capacity: 65,
        availability: true,
        currentOccupancy: 50,
        category: 'Classroom',
        facilities: ['Smart Screen', 'Lectern Mic', 'Whiteboard', 'AC']
      },
      {
        roomNumber: 'IB-102 Computing Center',
        building: buildings[13]._id,
        floor: 1,
        capacity: 50,
        availability: true,
        currentOccupancy: 45,
        category: 'Labs',
        facilities: ['Core i7 PCs', 'High-Speed Fiber Net', 'AC']
      },
      {
        roomNumber: 'IB-201 Classroom',
        building: buildings[13]._id,
        floor: 2,
        capacity: 65,
        availability: true,
        currentOccupancy: 20,
        category: 'Classroom',
        facilities: ['Smart Board', 'Projector', 'Power Outlets']
      },
      {
        roomNumber: 'IB-202 Smart Seminar Hall',
        building: buildings[13]._id,
        floor: 2,
        capacity: 70,
        availability: true,
        currentOccupancy: 35,
        category: 'Seminar Hall',
        facilities: ['PA System', 'Dual Projectors', 'AC']
      },

      // IB Block East Wing (Classes 118-125, 218-225)
      {
        roomNumber: 'IB-118 East Wing Classroom',
        building: buildings[14]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 30,
        category: 'Classroom',
        facilities: ['Smart Display', 'Whiteboard', 'AC']
      },
      {
        roomNumber: 'IB-119 East Wing Classroom',
        building: buildings[14]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 25,
        category: 'Classroom',
        facilities: ['Smart Board', 'Projector', 'Power Outlets']
      },
      {
        roomNumber: 'IB-120 Advanced AI & Cloud Lab',
        building: buildings[14]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 40,
        category: 'Labs',
        facilities: ['NVIDIA Workstations', 'Dual Monitors', 'Fiber Internet']
      },
      {
        roomNumber: 'IB-125 Multimedia Studio',
        building: buildings[14]._id,
        floor: 1,
        capacity: 50,
        availability: true,
        currentOccupancy: 18,
        category: 'Labs',
        facilities: ['Audio Recording', 'Video Edit Bay', 'AC']
      },
      {
        roomNumber: 'IB-218 East Wing Seminar Room',
        building: buildings[14]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 32,
        category: 'Seminar Hall',
        facilities: ['Video Conferencing', 'Dual Displays', 'Mic Array']
      },
      {
        roomNumber: 'IB-219 East Wing Classroom',
        building: buildings[14]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 10,
        category: 'Classroom',
        facilities: ['Smart Screen', 'Lectern Mic', 'AC']
      },
      {
        roomNumber: 'IB-225 Capstone Project Lab',
        building: buildings[14]._id,
        floor: 2,
        capacity: 50,
        availability: true,
        currentOccupancy: 22,
        category: 'Labs',
        facilities: ['3D Printers', 'IoT Testing Kits', 'Smart Board']
      },

      // Aeronautical Block
      {
        roomNumber: 'AERO-101 Wind Tunnel & Propulsion Lab',
        building: buildings[3]._id,
        floor: 1,
        capacity: 40,
        availability: true,
        currentOccupancy: 15,
        category: 'Labs',
        facilities: ['Subsonic Wind Tunnel', 'Propulsion Test Bench', 'Safety Hoods']
      },
      {
        roomNumber: 'AERO-201 Flight Simulator Room',
        building: buildings[3]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 20,
        category: 'Labs',
        facilities: ['Cockpit Simulator Rigs', 'Dual Displays', 'AC']
      },

      // SF Academic Block
      {
        roomNumber: 'SF-101 Software Engineering Lab',
        building: buildings[4]._id,
        floor: 1,
        capacity: 50,
        availability: true,
        currentOccupancy: 38,
        category: 'Labs',
        facilities: ['Core i7 Workstations', 'Smart Board', 'AC']
      },
      {
        roomNumber: 'SF-201 AI Innovation Center',
        building: buildings[4]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 29,
        category: 'Labs',
        facilities: ['GPU Servers', 'Dual Monitors', 'Fiber Net']
      },

      // Mechanical Engineering Block
      {
        roomNumber: 'MECH-101 CAD/CAM Simulation Lab',
        building: buildings[5]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 33,
        category: 'Labs',
        facilities: ['AutoCAD Software', 'SolidWorks Workstations', 'AC']
      },
      {
        roomNumber: 'MECH-201 Robotics & CNC Workshop',
        building: buildings[5]._id,
        floor: 2,
        capacity: 50,
        availability: true,
        currentOccupancy: 24,
        category: 'Labs',
        facilities: ['CNC Lathe Machines', 'Robotic Arm Units', 'Safety Gear']
      },

      // Learning Center
      {
        roomNumber: 'LC-101 Digital Resource Library Pod',
        building: buildings[12]._id,
        floor: 1,
        capacity: 30,
        availability: true,
        currentOccupancy: 12,
        category: 'Library Rooms',
        facilities: ['Digital Archival Monitors', 'Quiet Zone', 'High-Speed WiFi']
      },
      {
        roomNumber: 'LC-201 Central Conference Hall',
        building: buildings[12]._id,
        floor: 2,
        capacity: 80,
        availability: true,
        currentOccupancy: 45,
        category: 'Seminar Hall',
        facilities: ['PA System', 'Dual Projectors', 'Air Conditioning']
      },

      // BIT Auditorium
      {
        roomNumber: 'AUD-101 Grand Main Auditorium Stage',
        building: buildings[15]._id,
        floor: 1,
        capacity: 1500,
        availability: false,
        currentOccupancy: 1100,
        category: 'Auditorium',
        facilities: ['Dolby Atmos', 'Laser Projector', 'Stage Lighting', 'Live Stream Rig']
      }
    ]);



    console.log('[Seed] Inserting seed Assets...');
    const assets = await Asset.insertMany([
      {
        assetName: 'Apple MacBook Pro M3 Max Lab Unit',
        category: 'Electronics',
        status: 'Available',
        location: 'Computer Center Floor 2, Room B-204',
        building: buildings[2]._id,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600',
        availability: true,
        serialNumber: 'SN-MAC-2026-001'
      },
      {
        assetName: 'Meta Quest 3 VR Development Headset',
        category: 'VR Headset',
        status: 'Available',
        location: 'Innovation Lab A-102',
        building: buildings[0]._id,
        image: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?auto=format&fit=crop&q=80&w=600',
        availability: true,
        serialNumber: 'SN-VRQ3-2026-882'
      },
      {
        assetName: 'DJI Mavic 3 Pro Survey Drone',
        category: 'Drone',
        status: 'Reserved',
        location: 'GIS Spatial Analytics Center',
        building: buildings[0]._id,
        image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=600',
        availability: false,
        serialNumber: 'SN-DJI-DRONE-991'
      },
      {
        assetName: 'Ender 3 Pro High-Precision 3D Printer',
        category: '3D Printer',
        status: 'Available',
        location: 'Maker Studio B-105',
        building: buildings[2]._id,
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
        availability: true,
        serialNumber: 'SN-3DP-2026-302'
      }
    ]);

    console.log('[Seed] Inserting seed Bookings...');
    await Booking.create([
      {
        user: studentUser._id,
        asset: assets[0]._id,
        bookingType: 'Asset',
        date: '2026-08-06',
        startTime: '10:00 AM',
        endTime: '12:00 PM',
        durationHours: 2,
        purpose: 'Capstone Project Machine Learning Training',
        status: 'Approved',
        qrCodeData: 'CAMPUS-BOOKING-9912-STU1'
      },
      {
        user: facultyUser._id,
        room: rooms[2]._id,
        bookingType: 'Facility',
        date: '2026-08-07',
        startTime: '02:00 PM',
        endTime: '04:00 PM',
        durationHours: 2,
        purpose: 'Faculty Research Presentation & Workshop',
        status: 'Pending',
        qrCodeData: 'CAMPUS-BOOKING-8821-FAC1'
      }
    ]);

    console.log('[Seed] Inserting seed Events & LostFound...');
    await Event.create([
      {
        title: 'Annual Campus Spatial AI & Robotics Symposium 2026',
        description: 'Keynote speeches, interactive live demos, and spatial mapping hackathon.',
        date: '2026-08-15',
        time: '09:00 AM - 05:00 PM',
        location: 'Grand Campus Auditorium',
        organizer: 'Department of Computer Science',
        category: 'Academic',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'
      }
    ]);

    await LostFound.create([
      {
        title: 'Sony Noise-Canceling Headphones',
        description: 'Black WH-1000XM4 left on 3rd floor study desk in Central Library.',
        type: 'Found',
        category: 'Electronics',
        location: 'Main Central Library - 3rd Floor',
        date: '2026-08-04',
        contactPhone: '+1 (555) 019-2834',
        contactEmail: 'library-security@campus.edu',
        status: 'Open',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
        postedBy: studentUser._id
      }
    ]);

    console.log('[Seed] Seed completed successfully!');
  } catch (error) {
    console.error('[Seed Error]', error);
  }
};

module.exports = seedDatabase;
