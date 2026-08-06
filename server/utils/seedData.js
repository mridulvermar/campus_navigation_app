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
        name: 'Science & Innovation Block A',
        code: 'SCI-A',
        description: 'Advanced Research Laboratories, Physics and Chemistry cleanrooms, and Interactive Robotics Labs.',
        latitude: 37.774929,
        longitude: -122.419416,
        floorCount: 5,
        category: 'Research',
        openingHours: '07:00 AM - 11:00 PM',
        image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
        amenities: ['High-Speed WiFi', '3D Printing Lab', 'Cleanroom', 'Elevator', 'Cafe'],
        emergencyExits: [
          { floor: 1, locationName: 'North Ground Exit' },
          { floor: 2, locationName: 'East Stairwell Exit' }
        ]
      },
      {
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
    ]);

    console.log('[Seed] Inserting seed Rooms...');
    const rooms = await Room.insertMany([
      {
        roomNumber: 'A-301',
        building: buildings[0]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 12,
        category: 'Classroom',
        facilities: ['Smart Board', 'Projector', 'Air Conditioning', 'Power Outlets']
      },
      {
        roomNumber: 'A-102 (Clean Lab)',
        building: buildings[0]._id,
        floor: 1,
        capacity: 20,
        availability: true,
        currentOccupancy: 18,
        category: 'Labs',
        facilities: ['Fume Hoods', '3D Printers', 'Microscopes', 'Safety Shower']
      },
      {
        roomNumber: 'Seminar Room 204',
        building: buildings[1]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 35,
        category: 'Seminar Hall',
        facilities: ['Video Conferencing', 'Dual Displays', 'Mic Array']
      },
      {
        roomNumber: 'Main Stage Hall',
        building: buildings[4]._id,
        floor: 1,
        capacity: 1200,
        availability: false,
        currentOccupancy: 850,
        category: 'Auditorium',
        facilities: ['Sound System', 'Stage Lighting', 'Live Stream Rig']
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
