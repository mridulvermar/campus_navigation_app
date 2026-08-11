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
      },
      {
        name: 'Biotechnology & Life Sciences Complex',
        code: 'BIO-LIFE',
        description: 'Genomics research facility, bio-incubators, molecular biology labs, and greenhouse terrariums.',
        latitude: 37.775200,
        longitude: -122.416800,
        floorCount: 4,
        category: 'Research',
        openingHours: '08:00 AM - 09:00 PM',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
        amenities: ['DNA Sequencer Lab', 'Greenhouse', 'Autoclave Room', 'Cold Storage'],
        emergencyExits: [
          { floor: 1, locationName: 'Bio Hazard Safety Exit West' }
        ]
      },
      {
        name: 'Olympia Athletics & Indoor Sports Center',
        code: 'SPC-01',
        description: 'Indoor basketball courts, Olympic swimming pool, synthetic track, and fitness gym.',
        latitude: 37.772200,
        longitude: -122.419800,
        floorCount: 2,
        category: 'Sports',
        openingHours: '06:00 AM - 10:00 PM',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
        amenities: ['Olympic Pool', 'Fitness Gym', 'Badminton Courts', 'Locker Rooms'],
        emergencyExits: [
          { floor: 1, locationName: 'Track Stadium Gate' }
        ]
      },
      {
        name: 'Vice Chancellor Administration Block',
        code: 'ADM-01',
        description: 'University administration, registrar offices, admissions counter, and finance division.',
        latitude: 37.776800,
        longitude: -122.419000,
        floorCount: 3,
        category: 'Academic',
        openingHours: '09:00 AM - 05:30 PM',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
        amenities: ['Admissions Counter', 'Help Desk', 'Boardroom', 'Visitor Lounge'],
        emergencyExits: [
          { floor: 1, locationName: 'East Plaza Gate' }
        ]
      },
      {
        name: 'Center for Design & Media Arts',
        code: 'DMA-STUDIO',
        description: 'Digital art studios, sound engineering booths, green screen VR stages, and animation suites.',
        latitude: 37.774200,
        longitude: -122.417800,
        floorCount: 3,
        category: 'Academic',
        openingHours: '08:00 AM - 10:00 PM',
        image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=800',
        amenities: ['Audio Recording Studio', 'Green Screen Stage', 'Mac Editing Suites'],
        emergencyExits: [
          { floor: 1, locationName: 'Studio Fire Exit' }
        ]
      },
      {
        name: 'Campus Wellness & Emergency Medical Center',
        code: 'MED-01',
        description: '24/7 student health clinic, pharmacy, emergency room, and mental wellness counseling.',
        latitude: 37.773200,
        longitude: -122.422200,
        floorCount: 2,
        category: 'Academic',
        openingHours: '24/7 Emergency Care',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
        amenities: ['24/7 Pharmacy', 'Ambulance Bay', 'Triage Ward', 'Doctor Consult Rooms'],
        emergencyExits: [
          { floor: 1, locationName: 'Ambulance Emergency Ramp' }
        ]
      }
    ]);

    console.log('[Seed] Inserting seed Rooms...');
    const rooms = await Room.insertMany([
      // Science Block A Classrooms & Labs
      {
        roomNumber: 'SCI-101 Physics Cleanroom Lab',
        building: buildings[0]._id,
        floor: 1,
        capacity: 25,
        availability: true,
        currentOccupancy: 10,
        category: 'Labs',
        facilities: ['Laser Tables', 'Cleanroom Suits', 'Fume Hoods', 'Power Outlets']
      },
      {
        roomNumber: 'SCI-102 Nanotechnology Research Unit',
        building: buildings[0]._id,
        floor: 1,
        capacity: 20,
        availability: true,
        currentOccupancy: 18,
        category: 'Labs',
        facilities: ['Microscopes', '3D Printers', 'Fume Hoods', 'Safety Shower']
      },
      {
        roomNumber: 'SCI-201 Robotics Interactive Classroom',
        building: buildings[0]._id,
        floor: 2,
        capacity: 50,
        availability: true,
        currentOccupancy: 22,
        category: 'Classroom',
        facilities: ['Robotics Test Track', 'Smart Board', 'Dual 4K Displays', 'WiFi 6']
      },
      {
        roomNumber: 'SCI-301 Advanced AI Lecture Hall',
        building: buildings[0]._id,
        floor: 3,
        capacity: 75,
        availability: true,
        currentOccupancy: 35,
        category: 'Classroom',
        facilities: ['Tiered Seating', 'Surround Audio', 'HD Projector', 'AC']
      },

      // Engineering Quad B Classrooms & Computer Labs
      {
        roomNumber: 'ENG-101 High Performance Computing Lab',
        building: buildings[2]._id,
        floor: 1,
        capacity: 40,
        availability: true,
        currentOccupancy: 28,
        category: 'Labs',
        facilities: ['GPU Workstations', 'Dual Monitors', 'Fiber Internet', 'AC']
      },
      {
        roomNumber: 'ENG-102 Cloud & Cyber Security Lab',
        building: buildings[2]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 15,
        category: 'Labs',
        facilities: ['Server Racks', 'Cisco Routers', 'Smart Board', 'Power Outlets']
      },
      {
        roomNumber: 'ENG-201 Software Engineering Classroom',
        building: buildings[2]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 42,
        category: 'Classroom',
        facilities: ['Smart Screen', 'Lectern Mic', 'Whiteboard', 'Air Conditioning']
      },
      {
        roomNumber: 'ENG-301 Electrical Circuit Design Lab',
        building: buildings[2]._id,
        floor: 3,
        capacity: 35,
        availability: true,
        currentOccupancy: 19,
        category: 'Labs',
        facilities: ['Oscilloscopes', 'Soldering Stations', 'Function Generators']
      },

      // Main Central Library Seminar Rooms & Study Pods
      {
        roomNumber: 'LIB-101 Silent Study Pod Alpha',
        building: buildings[1]._id,
        floor: 1,
        capacity: 10,
        availability: true,
        currentOccupancy: 4,
        category: 'Library Rooms',
        facilities: ['Soundproof Walls', 'OLED Screen', 'Whiteboard', 'Quiet Zone']
      },
      {
        roomNumber: 'LIB-102 Digital Media & VR Study Pod',
        building: buildings[1]._id,
        floor: 1,
        capacity: 15,
        availability: true,
        currentOccupancy: 8,
        category: 'Library Rooms',
        facilities: ['VR Headsets', '4K TV', 'Conference Cam', 'Air Conditioning']
      },
      {
        roomNumber: 'LIB-201 Research Scholar Seminar Room',
        building: buildings[1]._id,
        floor: 2,
        capacity: 50,
        availability: true,
        currentOccupancy: 30,
        category: 'Seminar Hall',
        facilities: ['Video Conferencing', 'Dual Displays', 'Mic Array', 'Podium']
      },
      {
        roomNumber: 'LIB-301 Archival Reading Classroom',
        building: buildings[1]._id,
        floor: 3,
        capacity: 35,
        availability: true,
        currentOccupancy: 12,
        category: 'Classroom',
        facilities: ['Document Scanner', 'Smart Board', 'Rare Book Vault Access']
      },

      // Student Activity & Union Center
      {
        roomNumber: 'SAU-101 Student Clubs Assembly Hall',
        building: buildings[3]._id,
        floor: 1,
        capacity: 120,
        availability: true,
        currentOccupancy: 60,
        category: 'Seminar Hall',
        facilities: ['PA System', 'Stage Platform', 'Projector', 'Flexible Seating']
      },
      {
        roomNumber: 'SAU-102 Outdoor Athletics Turf Field 1',
        building: buildings[3]._id,
        floor: 1,
        capacity: 250,
        availability: true,
        currentOccupancy: 45,
        category: 'Sports Ground',
        facilities: ['Floodlights', 'Seating Stands', 'Scoreboard', 'Equipment Shed']
      },

      // Grand Campus Auditorium
      {
        roomNumber: 'AUD-101 Grand Main Stage Hall',
        building: buildings[4]._id,
        floor: 1,
        capacity: 1200,
        availability: false,
        currentOccupancy: 850,
        category: 'Auditorium',
        facilities: ['Dolby Atmos', 'Laser Projector', 'Stage Lighting', 'Live Stream Rig']
      },
      {
        roomNumber: 'AUD-201 VIP Conference Suite',
        building: buildings[4]._id,
        floor: 2,
        capacity: 35,
        availability: true,
        currentOccupancy: 10,
        category: 'Meeting Rooms',
        facilities: ['Executive Lounge', 'Video Conference Rig', 'Catering Table']
      },

      // Biotech & Life Sciences Complex
      {
        roomNumber: 'BIO-101 Genomics & Molecular Biology Lab',
        building: buildings[5]._id,
        floor: 1,
        capacity: 30,
        availability: true,
        currentOccupancy: 14,
        category: 'Labs',
        facilities: ['DNA Sequencers', 'Centrifuges', 'Incubators', 'Safety Hoods']
      },
      {
        roomNumber: 'BIO-201 Botany & Environmental Science Hall',
        building: buildings[5]._id,
        floor: 2,
        capacity: 55,
        availability: true,
        currentOccupancy: 20,
        category: 'Classroom',
        facilities: ['Smart Board', 'Microscope Screen Feed', 'Greenhouse Access']
      },

      // Administration Block
      {
        roomNumber: 'ADM-101 Executive Syndicate Boardroom',
        building: buildings[7]._id,
        floor: 1,
        capacity: 30,
        availability: true,
        currentOccupancy: 8,
        category: 'Meeting Rooms',
        facilities: ['Conference Table', 'Executive Microphones', 'Dual 4K TV']
      },

      // Design & Media Arts Studio
      {
        roomNumber: 'DMA-101 Digital Animation & Sound Suite',
        building: buildings[8]._id,
        floor: 1,
        capacity: 35,
        availability: true,
        currentOccupancy: 15,
        category: 'Labs',
        facilities: ['Soundproof Recording Booth', 'Green Screen', 'Mac Pro Workstations']
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
