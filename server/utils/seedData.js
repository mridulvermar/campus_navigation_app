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
        favoriteLocations: ['SF Block', 'Main Library']
      },
      {
        name: 'Dr. Sarah Vance',
        email: 'faculty@campus.edu',
        password: passwordHash,
        role: 'Faculty',
        department: 'Electrical Engineering',
        phone: '+1 (555) 392-8102',
        favoriteLocations: ['IB Block', 'AS Block']
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

    console.log('[Seed] Inserting 40 GeoBits Buildings...');
    const buildings = await Building.insertMany([
      {
        name: "SF Block",
        code: "SF-BLOCK",
        description: "SF Block academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.496,
        longitude: 77.2765,
        floorCount: 4,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "SF Block Labs",
        code: "SF-BLOCK-LABS",
        description: "SF Block Labs academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4959,
        longitude: 77.2766,
        floorCount: 4,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "Mech Block Entrance",
        code: "MECHANIC-FRONT",
        description: "Mech Block Entrance academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.495800000000001,
        longitude: 77.2767,
        floorCount: 4,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "Mechanic Block",
        code: "MECHANIC-BACK",
        description: "Mechanic Block academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.495700000000001,
        longitude: 77.2768,
        floorCount: 4,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "AS Block",
        code: "AS-MAIN-LEFT",
        description: "AS Block academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4956,
        longitude: 77.2769,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "Special Labs",
        code: "AS-MAIN-RIGHT",
        description: "Special Labs academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4955,
        longitude: 77.277,
        floorCount: 4,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "AS rib 1",
        code: "AS-RIB-1",
        description: "AS rib 1 academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4954,
        longitude: 77.2771,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "AS rib 2",
        code: "AS-RIB-2",
        description: "AS rib 2 academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4953,
        longitude: 77.2772,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "AS rib 3",
        code: "AS-RIB-3",
        description: "AS rib 3 academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4952,
        longitude: 77.2773,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "AS rib 4",
        code: "AS-RIB-4",
        description: "AS rib 4 academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4951,
        longitude: 77.2774,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "AS rib 5",
        code: "AS-RIB-5",
        description: "AS rib 5 academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.495000000000001,
        longitude: 77.2775,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "AS rib 6",
        code: "AS-RIB-6",
        description: "AS rib 6 academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.494900000000001,
        longitude: 77.27759999999999,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "AS rib 7",
        code: "AS-RIB-7",
        description: "AS rib 7 academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4948,
        longitude: 77.2777,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "AS rib 8",
        code: "AS-RIB-8",
        description: "AS rib 8 academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4947,
        longitude: 77.2778,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "AS rib 9",
        code: "AS-RIB-9",
        description: "AS rib 9 academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4946,
        longitude: 77.2779,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "AS rib 10",
        code: "AS-RIB-10",
        description: "AS rib 10 academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4945,
        longitude: 77.27799999999999,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "AS rib 11",
        code: "AS-RIB-11",
        description: "AS rib 11 academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4944,
        longitude: 77.2781,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "AS rib 12",
        code: "AS-RIB-12",
        description: "AS rib 12 academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4943,
        longitude: 77.2782,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "Fashion Resource Centre",
        code: "FASHION-CENTRE",
        description: "Fashion Resource Centre academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.494200000000001,
        longitude: 77.2783,
        floorCount: 2,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "Spinning Lab",
        code: "SPINNING-LAB",
        description: "Spinning Lab academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.494100000000001,
        longitude: 77.2784,
        floorCount: 2,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "IB Block",
        code: "IB-BLOCK-1",
        description: "IB Block academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.494,
        longitude: 77.2785,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "IB Block",
        code: "IB-BLOCK-2",
        description: "IB Block academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4939,
        longitude: 77.2786,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "IB rib 1",
        code: "IB-RIB-1",
        description: "IB rib 1 academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4938,
        longitude: 77.2787,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "IB rib 2",
        code: "IB-RIB-2",
        description: "IB rib 2 academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4937,
        longitude: 77.2788,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "IB rib 3",
        code: "IB-RIB-3",
        description: "IB rib 3 academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4936,
        longitude: 77.2789,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "IB rib 4",
        code: "IB-RIB-4",
        description: "IB rib 4 academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.493500000000001,
        longitude: 77.279,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "IB rib 5",
        code: "IB-RIB-5",
        description: "IB rib 5 academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.493400000000001,
        longitude: 77.2791,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "IB rib 6",
        code: "IB-RIB-6",
        description: "IB rib 6 academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4933,
        longitude: 77.2792,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "IB rib 7",
        code: "IB-RIB-7",
        description: "IB rib 7 academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4932,
        longitude: 77.27929999999999,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "IB rib 8",
        code: "IB-RIB-8",
        description: "IB rib 8 academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4931,
        longitude: 77.2794,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "IB rib 9",
        code: "IB-RIB-9",
        description: "IB rib 9 academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.493,
        longitude: 77.2795,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "IB rib 10",
        code: "IB-RIB-10",
        description: "IB rib 10 academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4929,
        longitude: 77.2796,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "IB rib 11",
        code: "IB-RIB-11",
        description: "IB rib 11 academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4928,
        longitude: 77.2797,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "IB rib 12",
        code: "IB-RIB-12",
        description: "IB rib 12 academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.492700000000001,
        longitude: 77.2798,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "Internet Centre",
        code: "INTERNET-CENTRE",
        description: "Internet Centre academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.492600000000001,
        longitude: 77.2799,
        floorCount: 2,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "Placement and Training Cell",
        code: "PLACEMENT-AND-TRAINING",
        description: "Placement and Training Cell academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4925,
        longitude: 77.28,
        floorCount: 2,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "Gym",
        code: "INDOOR-GYM",
        description: "Gym academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4924,
        longitude: 77.2801,
        floorCount: 3,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "Visitor hall (Boys)",
        code: "BOYS-VISITOR-HALL",
        description: "Visitor hall (Boys) academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4923,
        longitude: 77.2802,
        floorCount: 1,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "Recreation Hall",
        code: "RECREATION-HALL",
        description: "Recreation Hall academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4922,
        longitude: 77.2803,
        floorCount: 2,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      },
      {
        name: "Mess",
        code: "GIRLS-MESS",
        description: "Mess academic and facility complex at Bannari Amman Institute of Technology.",
        latitude: 11.4921,
        longitude: 77.2804,
        floorCount: 2,
        category: "Academic",
        openingHours: "08:00 AM - 08:00 PM",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        amenities: ["Smart Classrooms","High-Speed WiFi","Air Conditioning"]
      }
    ]);

    console.log('[Seed] Inserting 428 GeoBits Extracted Rooms...');
    const rooms = await Room.insertMany([
      {
        roomNumber: "IT 001 (SF Block - Base Floor)",
        building: buildings[0]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 1,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "IT 002 (SF Block - Base Floor)",
        building: buildings[0]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 5,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "IT 003 (SF Block - Base Floor)",
        building: buildings[0]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 1,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "IT Seminar Hall (SF Block - Base Floor)",
        building: buildings[0]._id,
        floor: 1,
        capacity: 75,
        availability: true,
        currentOccupancy: 21,
        category: "Seminar Hall",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "IT 101 (SF Block - Ground Floor)",
        building: buildings[0]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 22,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "IT 102 (SF Block - Ground Floor)",
        building: buildings[0]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 18,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Information Technology (SF Block - Ground Floor)",
        building: buildings[0]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 23,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Artificial Intelligence Lab (AI Lab) (SF Block - Ground Floor)",
        building: buildings[0]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 6,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CS 201 (SF Block - First Floor)",
        building: buildings[0]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 17,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CS 202 💞 (SF Block - First Floor)",
        building: buildings[0]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 3,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CS 203 (SF Block - First Floor)",
        building: buildings[0]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 3,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Computer Science and Engineering (SF Block - First Floor)",
        building: buildings[0]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 17,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CSE Lab 1 (SF Block - First Floor)",
        building: buildings[0]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 22,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "AIML 101 (SF Block - Second Floor)",
        building: buildings[0]._id,
        floor: 4,
        capacity: 60,
        availability: true,
        currentOccupancy: 8,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CS 302 (SF Block - Second Floor)",
        building: buildings[0]._id,
        floor: 4,
        capacity: 60,
        availability: true,
        currentOccupancy: 19,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CS 303 (SF Block - Second Floor)",
        building: buildings[0]._id,
        floor: 4,
        capacity: 60,
        availability: true,
        currentOccupancy: 13,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Auditorium (SF Block - Second Floor)",
        building: buildings[0]._id,
        floor: 4,
        capacity: 1500,
        availability: true,
        currentOccupancy: 6,
        category: "Auditorium",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Civil Practical Labs (SF Block Labs - Base Floor)",
        building: buildings[1]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 19,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Data Mining Lab (SF Block Labs - Ground Floor)",
        building: buildings[1]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 17,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Cloud Computing Lab (SF Block Labs - Ground Floor)",
        building: buildings[1]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 21,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "DBMS Lab (SF Block Labs - Ground Floor)",
        building: buildings[1]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 23,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall 5 (SF Block Labs - Ground Floor)",
        building: buildings[1]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 23,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall 7 (SF Block Labs - Ground Floor)",
        building: buildings[1]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 4,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Programming Lab (SF Block Labs - Ground Floor)",
        building: buildings[1]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 5,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "sunflower block (SF Block Labs - Ground Floor)",
        building: buildings[1]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 11,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CSE Lab 2 (SF Block Labs - First Floor)",
        building: buildings[1]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 5,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CSE Lab 3 (Networking Lab) (SF Block Labs - First Floor)",
        building: buildings[1]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 21,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall 5 (SF Block Labs - First Floor)",
        building: buildings[1]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 15,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CSE Lab 4 (Web Technology Lab) (SF Block Labs - First Floor)",
        building: buildings[1]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 19,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CSE Lab 5 (Open Source Lab) (SF Block Labs - First Floor)",
        building: buildings[1]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 2,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Artificial Intelligence and Machine Learning (SF Block Labs - Second Floor)",
        building: buildings[1]._id,
        floor: 4,
        capacity: 60,
        availability: true,
        currentOccupancy: 17,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CSE Lab 6 (SF Block Labs - Second Floor)",
        building: buildings[1]._id,
        floor: 4,
        capacity: 45,
        availability: true,
        currentOccupancy: 20,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CSE Lab 7 (Data Structure Lab 7) (SF Block Labs - Second Floor)",
        building: buildings[1]._id,
        floor: 4,
        capacity: 45,
        availability: true,
        currentOccupancy: 3,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CSE Lab 8 (SF Block Labs - Second Floor)",
        building: buildings[1]._id,
        floor: 4,
        capacity: 45,
        availability: true,
        currentOccupancy: 10,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CSE Lab 9 (SF Block Labs - Second Floor)",
        building: buildings[1]._id,
        floor: 4,
        capacity: 45,
        availability: true,
        currentOccupancy: 14,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall 10 (SF Block Labs - Second Floor)",
        building: buildings[1]._id,
        floor: 4,
        capacity: 60,
        availability: true,
        currentOccupancy: 23,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Mechanical Engineering (Mech Block Entrance - Ground Floor)",
        building: buildings[2]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 10,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department office (Mech) (Mech Block Entrance - Ground Floor)",
        building: buildings[2]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 5,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department Library (Mech) (Mech Block Entrance - Ground Floor)",
        building: buildings[2]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 8,
        category: "Library Rooms",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Smart class room (Mech Block Entrance - Ground Floor)",
        building: buildings[2]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 4,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Reprography Center (Mech Block Entrance - Ground Floor)",
        building: buildings[2]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 8,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Cyber Security Lab (Mech Block Entrance - Ground Floor)",
        building: buildings[2]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 18,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Mechanics (Mech Block Entrance - First Floor)",
        building: buildings[2]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 13,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Mathematics Experience Centre (ME 101) (Mech Block Entrance - First Floor)",
        building: buildings[2]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 19,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ME 102 (Mech Block Entrance - First Floor)",
        building: buildings[2]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 21,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ME 103 (Mech Block Entrance - First Floor)",
        building: buildings[2]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 5,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ME 104 (Mech Block Entrance - First Floor)",
        building: buildings[2]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 18,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ME 105 (Mech Block Entrance - First Floor)",
        building: buildings[2]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 6,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ME 106 (Mech Block Entrance - First Floor)",
        building: buildings[2]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 20,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ME 107 (Mech Block Entrance - First Floor)",
        building: buildings[2]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 9,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ME 108 (Mech Block Entrance - First Floor)",
        building: buildings[2]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 20,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Aeronautical (Mech Block Entrance - Second Floor)",
        building: buildings[2]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 19,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ME 201 (Mech Block Entrance - Second Floor)",
        building: buildings[2]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 0,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ME 202 (Mech Block Entrance - Second Floor)",
        building: buildings[2]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 14,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ME 203 (Mech Block Entrance - Second Floor)",
        building: buildings[2]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 17,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ME 204 (Mech Block Entrance - Second Floor)",
        building: buildings[2]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 7,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ME 205 (Mech Block Entrance - Second Floor)",
        building: buildings[2]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 10,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ME 206 (Mech Block Entrance - Second Floor)",
        building: buildings[2]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 0,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall 1 (Mech Block Entrance - Second Floor)",
        building: buildings[2]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 15,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Agriculture (Mech Block Entrance - Third Floor)",
        building: buildings[2]._id,
        floor: 4,
        capacity: 60,
        availability: true,
        currentOccupancy: 2,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ME 301 (Mech Block Entrance - Third Floor)",
        building: buildings[2]._id,
        floor: 4,
        capacity: 60,
        availability: true,
        currentOccupancy: 8,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ME 302 (Mech Block Entrance - Third Floor)",
        building: buildings[2]._id,
        floor: 4,
        capacity: 60,
        availability: true,
        currentOccupancy: 23,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ME 303 (Mech Block Entrance - Third Floor)",
        building: buildings[2]._id,
        floor: 4,
        capacity: 60,
        availability: true,
        currentOccupancy: 0,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ME 304 (Mech Block Entrance - Third Floor)",
        building: buildings[2]._id,
        floor: 4,
        capacity: 60,
        availability: true,
        currentOccupancy: 23,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ME 305 (Mech Block Entrance - Third Floor)",
        building: buildings[2]._id,
        floor: 4,
        capacity: 60,
        availability: true,
        currentOccupancy: 1,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ME 306 (Mech Block Entrance - Third Floor)",
        building: buildings[2]._id,
        floor: 4,
        capacity: 60,
        availability: true,
        currentOccupancy: 2,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall  2 (Mech Block Entrance - Third Floor)",
        building: buildings[2]._id,
        floor: 4,
        capacity: 60,
        availability: true,
        currentOccupancy: 20,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Basic Workshop (Mechanic Block - Base Floor)",
        building: buildings[3]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 22,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Inventory Area (Mechanic Block - Base Floor)",
        building: buildings[3]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 9,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Special Machinery Shop (Mechanic Block - Ground floor)",
        building: buildings[3]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 11,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Strength of Materials Lab (Mechanic Block - Ground floor)",
        building: buildings[3]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 7,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Lathe Shop (Mechanic Block - Ground floor)",
        building: buildings[3]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 6,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Meteorology Lab (Mechanic Block - Ground floor)",
        building: buildings[3]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 17,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Aqua Sub BIT research center (Mechanic Block - Ground floor)",
        building: buildings[3]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 12,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Fluid Mechanics (Mechanic Block - Ground floor)",
        building: buildings[3]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 4,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Thermal Engineering lab (Mechanic Block - Ground floor)",
        building: buildings[3]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 4,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Non-Destructive Testing Lab (Mechanic Block - Ground floor)",
        building: buildings[3]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 11,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Sensor and Instrumentation lab (Mechanic Block - First Floor)",
        building: buildings[3]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 24,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "MEMS Laboratory (Mechanic Block - First Floor)",
        building: buildings[3]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 2,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Mechatronics Lab (Mechanic Block - First Floor)",
        building: buildings[3]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 22,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "BIT - Harita Lab (Mechanic Block - First Floor)",
        building: buildings[3]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 3,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Sew Eurodrive Lab (Mechanic Block - First Floor)",
        building: buildings[3]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 19,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Kinematics & Dynamic Lab (Mechanic Block - First Floor)",
        building: buildings[3]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 0,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Metallurgy Lab (Mechanic Block - First Floor)",
        building: buildings[3]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 17,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Aircraft Structure Lab (Mechanic Block - First Floor)",
        building: buildings[3]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 16,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Avionics Lab (Mechanic Block - First Floor)",
        building: buildings[3]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 4,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Basic Workshop (Mechanic Block - First Floor)",
        building: buildings[3]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 22,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Industrial and Mobile Robotics Lab (Mechanic Block - First Floor)",
        building: buildings[3]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 1,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CAM Lab (Mechanic Block - First Floor)",
        building: buildings[3]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 4,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "FANUC centre for FOR CNC Machine (Mechanic Block - First Floor)",
        building: buildings[3]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 16,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "BIT - FESTO Centre (Mechanic Block - First Floor)",
        building: buildings[3]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 2,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CAD Lab (Mechanic Block - First Floor)",
        building: buildings[3]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 14,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Heat Transfer Lab (Mechanic Block - Second Floor)",
        building: buildings[3]._id,
        floor: 4,
        capacity: 45,
        availability: true,
        currentOccupancy: 15,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Industrial Safety Lab (Mechanic Block - Second Floor)",
        building: buildings[3]._id,
        floor: 4,
        capacity: 45,
        availability: true,
        currentOccupancy: 15,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Energy Management Lab (Mechanic Block - Second Floor)",
        building: buildings[3]._id,
        floor: 4,
        capacity: 45,
        availability: true,
        currentOccupancy: 7,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Automative Components Lab (Mechanic Block - Second Floor)",
        building: buildings[3]._id,
        floor: 4,
        capacity: 45,
        availability: true,
        currentOccupancy: 18,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Smart Agriculture Lab (Mechanic Block - Second Floor)",
        building: buildings[3]._id,
        floor: 4,
        capacity: 45,
        availability: true,
        currentOccupancy: 15,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Drawing Hall 1 (Mechanic Block - Second Floor)",
        building: buildings[3]._id,
        floor: 4,
        capacity: 60,
        availability: true,
        currentOccupancy: 14,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Drawing Hall 2 (Mechanic Block - Second Floor)",
        building: buildings[3]._id,
        floor: 4,
        capacity: 60,
        availability: true,
        currentOccupancy: 2,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Fundamentals of Mechanical Engg Lab (Mechanic Block - Second Floor)",
        building: buildings[3]._id,
        floor: 4,
        capacity: 45,
        availability: true,
        currentOccupancy: 5,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Statics Laboratory (Mechanic Block - Second Floor)",
        building: buildings[3]._id,
        floor: 4,
        capacity: 45,
        availability: true,
        currentOccupancy: 22,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CS 109 (AS Block - Ground Floor)",
        building: buildings[4]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 12,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "New Product Development Lab (CS 110) (AS Block - Ground Floor)",
        building: buildings[4]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 1,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Digital Marketing Lab (CS 111) (AS Block - Ground Floor)",
        building: buildings[4]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 3,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Research Lab (CS 112) (AS Block - Ground Floor)",
        building: buildings[4]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 5,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Test and Repair Centre (AS Block - Ground Floor)",
        building: buildings[4]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 17,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Industrial Design Studio (AS Block - Ground Floor)",
        building: buildings[4]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 8,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "IT Operations (AS Block - Ground Floor)",
        building: buildings[4]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 7,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Information Science and Technology (AS Block - First floor)",
        building: buildings[4]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 13,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ISE Lab 1 (AS Block - First floor)",
        building: buildings[4]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 12,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ISE Lab 2 (AS Block - First floor)",
        building: buildings[4]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 21,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Server Room (AS Block - First floor)",
        building: buildings[4]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 9,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall 1 (AS Block - First floor)",
        building: buildings[4]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 18,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Robotics & Automation Lab (AS Block - First floor)",
        building: buildings[4]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 0,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "BT Lab (AS Block - First floor)",
        building: buildings[4]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 4,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Discussion Room (AS Block - Second Floor)",
        building: buildings[4]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 5,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Conference Room (AS Block - Second Floor)",
        building: buildings[4]._id,
        floor: 3,
        capacity: 75,
        availability: true,
        currentOccupancy: 22,
        category: "Seminar Hall",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Data Science Lab (AS Block - Second Floor)",
        building: buildings[4]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 24,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Open Source Lab (AS Block - Second Floor)",
        building: buildings[4]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 18,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "AR/VR Lab (AS Block - Second Floor)",
        building: buildings[4]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 15,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Design & Prototyping Lab (AS Block - Second Floor)",
        building: buildings[4]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 4,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Hackathon Lab (AS Block - Second Floor)",
        building: buildings[4]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 10,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Integrated AI Lab (AS Block - Second Floor)",
        building: buildings[4]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 10,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Sensor Lab (AS Block - Second Floor)",
        building: buildings[4]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 16,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Vision Engineering Lab (AS Block - Second Floor)",
        building: buildings[4]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 4,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Embedded Systems Lab (AS Block - Second Floor)",
        building: buildings[4]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 19,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "UAV Lab (AS Block - Second Floor)",
        building: buildings[4]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 11,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "UUV Lab (AS Block - Second Floor)",
        building: buildings[4]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 24,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Robotics Lab (AS Block - Second Floor)",
        building: buildings[4]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 9,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Automation Lab (AS Block - Second Floor)",
        building: buildings[4]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 1,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Manufacturing and Fabrication Lab (Special Labs - Base Floor)",
        building: buildings[5]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 5,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Hybrid Human Powered Vehicle (Special Labs - Base Floor)",
        building: buildings[5]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 3,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Agricultural Vehicle (Special Labs - Base Floor)",
        building: buildings[5]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 2,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "On Road Off Road Vehicle (Special Labs - Base Floor)",
        building: buildings[5]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 23,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "MF Lab (Special Labs - Base Floor)",
        building: buildings[5]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 14,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Sustainable Civil Engineering Materials Lab (Special Labs - Base Floor)",
        building: buildings[5]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 22,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Kart Vehicle (Special Labs - Base Floor)",
        building: buildings[5]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 19,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Electrical Vehicle (Special Labs - Base Floor)",
        building: buildings[5]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 17,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Reprographic Centre (Special Labs - Ground floor)",
        building: buildings[5]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 11,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CB 101 (Special Labs - Ground floor)",
        building: buildings[5]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 8,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Electronic System for Wildlife Conservation Lab (Special Labs - Ground floor)",
        building: buildings[5]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 0,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Virtual Instrumentation Lab (Special Labs - Ground floor)",
        building: buildings[5]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 14,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Block Chain Technology Lab (Special Labs - Ground floor)",
        building: buildings[5]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 9,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Product Innovation Lab (Special Labs - Ground floor)",
        building: buildings[5]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 15,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Intelligence Innovation Lab (Special Labs - Ground floor)",
        building: buildings[5]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 13,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Natural Language Processing (NLP) Lab (Special Labs - Ground floor)",
        building: buildings[5]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 16,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Power Conversion and System Integration Lab (Special Labs - Ground floor)",
        building: buildings[5]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 20,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Signal Processing for Health Care Lab (Special Labs - Ground floor)",
        building: buildings[5]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 21,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "World Skill Training Centre (Special Labs - Ground floor)",
        building: buildings[5]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 3,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Computer Science and Business System (Special Labs - First Floor)",
        building: buildings[5]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 6,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CSBS Lab 1 (Special Labs - First Floor)",
        building: buildings[5]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 13,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CSBS Lab 2 (Special Labs - First Floor)",
        building: buildings[5]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 6,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CSBS Lab 3 (Special Labs - First Floor)",
        building: buildings[5]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 6,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Mathematics Experience Centre (Special Labs - First Floor)",
        building: buildings[5]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 9,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Embedded Technology Lab (Special Labs - First Floor)",
        building: buildings[5]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 11,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Energy and Thermal Product Development Lab (Special Labs - First Floor)",
        building: buildings[5]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 23,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Internet of Things (IoT) Lab (Special Labs - Second Floor)",
        building: buildings[5]._id,
        floor: 4,
        capacity: 45,
        availability: true,
        currentOccupancy: 19,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Cloud Computing Lab (Special Labs - Second Floor)",
        building: buildings[5]._id,
        floor: 4,
        capacity: 45,
        availability: true,
        currentOccupancy: 13,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Data Science Lab (Special Labs - Second Floor)",
        building: buildings[5]._id,
        floor: 4,
        capacity: 45,
        availability: true,
        currentOccupancy: 10,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Electrical Product Development Lab (Special Labs - Second Floor)",
        building: buildings[5]._id,
        floor: 4,
        capacity: 45,
        availability: true,
        currentOccupancy: 12,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Next Generation Networking Lab (Special Labs - Second Floor)",
        building: buildings[5]._id,
        floor: 4,
        capacity: 45,
        availability: true,
        currentOccupancy: 19,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Communication & Protocol Lab (Special Labs - Second Floor)",
        building: buildings[5]._id,
        floor: 4,
        capacity: 45,
        availability: true,
        currentOccupancy: 22,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Energy Storage & Conversion Lab (Special Labs - Second Floor)",
        building: buildings[5]._id,
        floor: 4,
        capacity: 45,
        availability: true,
        currentOccupancy: 20,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Micro Prototyping Lab (Special Labs - Second Floor)",
        building: buildings[5]._id,
        floor: 4,
        capacity: 45,
        availability: true,
        currentOccupancy: 9,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Robotics Division (Special Labs - Second Floor)",
        building: buildings[5]._id,
        floor: 4,
        capacity: 60,
        availability: true,
        currentOccupancy: 20,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Drone division (Special Labs - Second Floor)",
        building: buildings[5]._id,
        floor: 4,
        capacity: 60,
        availability: true,
        currentOccupancy: 16,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "3D printing Division (Special Labs - Second Floor)",
        building: buildings[5]._id,
        floor: 4,
        capacity: 60,
        availability: true,
        currentOccupancy: 5,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "AI Lab (Special Labs - Second Floor)",
        building: buildings[5]._id,
        floor: 4,
        capacity: 45,
        availability: true,
        currentOccupancy: 17,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Mobile and Web App Dev Lab (Special Labs - Second Floor)",
        building: buildings[5]._id,
        floor: 4,
        capacity: 45,
        availability: true,
        currentOccupancy: 4,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Biomedical Engineering (AS rib 1 - Ground Floor)",
        building: buildings[6]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 23,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall (AS rib 1 - Ground Floor)",
        building: buildings[6]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 8,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 113 (AS rib 1 - First Floor)",
        building: buildings[6]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 20,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 114 (AS rib 1 - First Floor)",
        building: buildings[6]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 0,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 115 (AS rib 1 - First Floor)",
        building: buildings[6]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 4,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 213 (AS rib 1 - Second Floor)",
        building: buildings[6]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 7,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 214 (AS rib 1 - Second Floor)",
        building: buildings[6]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 20,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 215 (AS rib 1 - Second Floor)",
        building: buildings[6]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 15,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Chemistry (AS rib 2 - Ground Floor)",
        building: buildings[7]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 2,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall (AS rib 2 - Ground Floor)",
        building: buildings[7]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 5,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Chemistry Laboratory - 1 (AS rib 2 - Ground Floor)",
        building: buildings[7]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 7,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Language Lab (AS rib 2 - First Floor)",
        building: buildings[7]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 14,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ELCC Cell (AS rib 2 - First Floor)",
        building: buildings[7]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 23,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall (AS rib 2 - First Floor)",
        building: buildings[7]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 22,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Physics Laboratory - 1 (AS rib 2 - Second Floor)",
        building: buildings[7]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 2,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall (AS rib 2 - Second Floor)",
        building: buildings[7]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 4,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Civil Engineering (AS rib 3 - Ground Floor)",
        building: buildings[8]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 6,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall (AS rib 3 - Ground Floor)",
        building: buildings[8]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 4,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Conference Hall (AS rib 3 - Ground Floor)",
        building: buildings[8]._id,
        floor: 1,
        capacity: 75,
        availability: true,
        currentOccupancy: 21,
        category: "Seminar Hall",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 116 (AS rib 3 - First Floor)",
        building: buildings[8]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 1,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 117 (AS rib 3 - First Floor)",
        building: buildings[8]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 22,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 118 (AS rib 3 - First Floor)",
        building: buildings[8]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 19,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 216 (AS rib 3 - Second Floor)",
        building: buildings[8]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 5,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 217 (AS rib 3 - Second Floor)",
        building: buildings[8]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 21,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 218 (AS rib 3 - Second Floor)",
        building: buildings[8]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 12,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall (AS rib 4 - Ground Floor)",
        building: buildings[9]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 12,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Signal Processing Lab (AS rib 4 - Ground Floor)",
        building: buildings[9]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 18,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "PCB Design Lab (AS rib 4 - Ground Floor)",
        building: buildings[9]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 9,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "PCB Fabrication Lab (AS rib 4 - Ground Floor)",
        building: buildings[9]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 21,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Physics (AS rib 4 - First Floor)",
        building: buildings[9]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 18,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Physics Laboratory - 2 (AS rib 4 - First Floor)",
        building: buildings[9]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 18,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty  Hall (AS rib 4 - First Floor)",
        building: buildings[9]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 15,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Chemistry Laboratory - 2 (AS rib 4 - Second Floor)",
        building: buildings[9]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 19,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall (AS rib 4 - Second Floor)",
        building: buildings[9]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 22,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall 2 (AS rib 5 - Ground Floor)",
        building: buildings[10]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 17,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 107 (AS rib 5 - First Floor)",
        building: buildings[10]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 8,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 108 ❤️‍🩹 (AS rib 5 - First Floor)",
        building: buildings[10]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 11,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 109 (AS rib 5 - First Floor)",
        building: buildings[10]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 24,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 207 (AS rib 5 - Second Floor)",
        building: buildings[10]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 5,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 208 (AS rib 5 - Second Floor)",
        building: buildings[10]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 3,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 209 (AS rib 5 - Second Floor)",
        building: buildings[10]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 4,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall (AS rib 6 - Ground Floor)",
        building: buildings[11]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 7,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Soil Mechanic Lab (AS rib 6 - Ground Floor)",
        building: buildings[11]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 22,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CADD & Survey Lab (AS rib 6 - First Floor)",
        building: buildings[11]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 2,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Survey & Environmental Lab (AS rib 6 - First Floor)",
        building: buildings[11]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 3,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Biochemistry Lab (AS rib 6 - Second Floor)",
        building: buildings[11]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 17,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Physiology Lab (AS rib 6 - Second Floor)",
        building: buildings[11]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 23,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Electrical and Communication Engineering (AS rib 7 - Ground Floor)",
        building: buildings[12]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 20,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall 1 (AS rib 7 - Ground Floor)",
        building: buildings[12]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 6,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ECE Seminar Hall (AS rib 7 - Ground Floor)",
        building: buildings[12]._id,
        floor: 1,
        capacity: 75,
        availability: true,
        currentOccupancy: 5,
        category: "Seminar Hall",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall 3 (AS rib 7 - First Floor)",
        building: buildings[12]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 20,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 111 (AS rib 7 - First Floor)",
        building: buildings[12]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 1,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 112 (AS rib 7 - First Floor)",
        building: buildings[12]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 3,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 210 (AS rib 7 - Second Floor)",
        building: buildings[12]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 7,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 211 (AS rib 7 - Second Floor)",
        building: buildings[12]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 0,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 212 (AS rib 7 - Second Floor)",
        building: buildings[12]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 12,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Analog electronic & IC Lab (AS rib 8 - Ground Floor)",
        building: buildings[13]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 9,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Advanced Communication System Lab (AS rib 8 - Ground Floor)",
        building: buildings[13]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 16,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Network Lab (AS rib 8 - First Floor)",
        building: buildings[13]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 19,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "PG VLSI Lab (AS rib 8 - First Floor)",
        building: buildings[13]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 17,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Product Development Lab (AS rib 8 - First Floor)",
        building: buildings[13]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 5,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Analog & Digital Lab (AS rib 8 - Second Floor)",
        building: buildings[13]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 14,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Microwave & Optical Lab (AS rib 8 - Second Floor)",
        building: buildings[13]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 22,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Food Technology (AS rib 9 - Ground Floor)",
        building: buildings[14]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 13,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall (AS rib 9 - Ground Floor)",
        building: buildings[14]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 14,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 101 (AS rib 9 - First Floor)",
        building: buildings[14]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 9,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 102 (AS rib 9 - First Floor)",
        building: buildings[14]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 22,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 103 (AS rib 9 - First Floor)",
        building: buildings[14]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 11,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 201 (AS rib 9 - Second Floor)",
        building: buildings[14]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 11,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 202 (AS rib 9 - Second Floor)",
        building: buildings[14]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 16,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 203 (AS rib 9 - Second Floor)",
        building: buildings[14]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 6,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Chemical Processing Lab (AS rib 10 - Ground Floor)",
        building: buildings[15]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 4,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Apparel Testing Lab (AS rib 10 - First Floor)",
        building: buildings[15]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 10,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Textile Testing Lab (AS rib 10 - First Floor)",
        building: buildings[15]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 7,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall (AS rib 10 - First Floor)",
        building: buildings[15]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 8,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "VLSI Design Lab (AS rib 10 - Second Floor)",
        building: buildings[15]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 15,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Digital Electronic Lab (AS rib 10 - Second Floor)",
        building: buildings[15]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 22,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Microprocessor & Microcontroller Lab (AS rib 10 - Second Floor)",
        building: buildings[15]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 10,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Textile Technology (AS rib 11 - Ground Floor)",
        building: buildings[16]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 21,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall (AS rib 11 - Ground Floor)",
        building: buildings[16]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 4,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Textile Seminar Hall (AS rib 11 - Ground Floor)",
        building: buildings[16]._id,
        floor: 1,
        capacity: 75,
        availability: true,
        currentOccupancy: 4,
        category: "Seminar Hall",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 104 (AS rib 11 - First Floor)",
        building: buildings[16]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 3,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 105 (AS rib 11 - First Floor)",
        building: buildings[16]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 14,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 106 (AS rib 11 - First Floor)",
        building: buildings[16]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 17,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 204 (AS rib 11 - Second Floor)",
        building: buildings[16]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 14,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 205 (AS rib 11 - Second Floor)",
        building: buildings[16]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 4,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EW 206 (AS rib 11 - Second Floor)",
        building: buildings[16]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 16,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Weaving and Knitting Lab (AS rib 12 - Ground Floor)",
        building: buildings[17]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 17,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Food Technology Lab (AS rib 12 - First Floor)",
        building: buildings[17]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 1,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Food Analysis and Instrumentation Facility (AS rib 12 - Second Floor)",
        building: buildings[17]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 19,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Food Technology Lab - 2 (AS rib 12 - Second Floor)",
        building: buildings[17]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 15,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Fashion Technology (Fashion Resource Centre - Ground Floor)",
        building: buildings[18]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 24,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall (Fashion Resource Centre - Ground Floor)",
        building: buildings[18]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 0,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Class rooms (Fashion Resource Centre - First Floor)",
        building: buildings[18]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 9,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Garment Construction Lab 1 (Fashion Resource Centre - First Floor)",
        building: buildings[18]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 0,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Garment Construction Lab 2 (Fashion Resource Centre - First Floor)",
        building: buildings[18]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 16,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Spinning Lab (Spinning Lab - Ground Floor)",
        building: buildings[19]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 4,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Spinning Lab (Spinning Lab - First Floor)",
        building: buildings[19]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 13,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Mathematics (IB Block - Ground Floor)",
        building: buildings[20]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 19,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "IB 101 (left as it is in remainder of old names) (IB Block - Ground Floor)",
        building: buildings[20]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 12,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 002 (IB Block - Ground Floor)",
        building: buildings[20]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 12,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 003 (IB Block - Ground Floor)",
        building: buildings[20]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 6,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 004 (IB Block - Ground Floor)",
        building: buildings[20]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 1,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Maths Faculty Hall - 1 (IB Block - Ground Floor)",
        building: buildings[20]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 6,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Maths Faculty Hall - 2 (IB Block - Ground Floor)",
        building: buildings[20]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 2,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Biotech Seminar Hall (IB Block - Ground Floor)",
        building: buildings[20]._id,
        floor: 1,
        capacity: 75,
        availability: true,
        currentOccupancy: 12,
        category: "Seminar Hall",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Genetic Engineering Lab (IB Block - First Floor)",
        building: buildings[20]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 12,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Molecular Biology Lab (IB Block - First Floor)",
        building: buildings[20]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 9,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Bio-polymer Lab (IB Block - First Floor)",
        building: buildings[20]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 22,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Bio Material Synthesis and Analysis Lab (IB Block - First Floor)",
        building: buildings[20]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 12,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Bio-prospecting Lab (IB Block - First Floor)",
        building: buildings[20]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 14,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Bio-Technology (IB Block - First Floor)",
        building: buildings[20]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 24,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Plant Issue Culture Lab (IB Block - First Floor)",
        building: buildings[20]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 6,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall (IB Block - First Floor)",
        building: buildings[20]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 17,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 216 (IB Block - Second Floor)",
        building: buildings[20]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 13,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 217 (IB Block - Second Floor)",
        building: buildings[20]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 9,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 218 (IB Block - Second Floor)",
        building: buildings[20]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 17,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 219 (IB Block - Second Floor)",
        building: buildings[20]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 9,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 220 (IB Block - Second Floor)",
        building: buildings[20]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 13,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 221 (IB Block - Second Floor)",
        building: buildings[20]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 24,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Maths Faculty Hall - 5 (IB Block - Second Floor)",
        building: buildings[20]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 16,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 005 (IB Block - Ground Floor)",
        building: buildings[21]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 7,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 006 (IB Block - Ground Floor)",
        building: buildings[21]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 23,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 007 (IB Block - Ground Floor)",
        building: buildings[21]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 23,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 008 (IB Block - Ground Floor)",
        building: buildings[21]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 20,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 010 (IB Block - Ground Floor)",
        building: buildings[21]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 9,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 011 (IB Block - Ground Floor)",
        building: buildings[21]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 20,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 012 (IB Block - Ground Floor)",
        building: buildings[21]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 0,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Bio-process and Bio-product Lab (IB Block - Ground Floor)",
        building: buildings[21]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 15,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "BIT Integrated Plant Research Facility (IB Block - Ground Floor)",
        building: buildings[21]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 18,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Bio Energy Research Lab (IB Block - Ground Floor)",
        building: buildings[21]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 14,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Fungal Bio-diversity and Bio-resources Research Lab (IB Block - First Floor)",
        building: buildings[21]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 10,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Lecture Hall IB 118 (IB Block - First Floor)",
        building: buildings[21]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 19,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Nano Biotechnology Lab (IB Block - First Floor)",
        building: buildings[21]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 9,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Molecular Diagnostic and Bacterial Pathogenemis Lab (IB Block - First Floor)",
        building: buildings[21]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 8,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Downstream Processing Lab (IB Block - First Floor)",
        building: buildings[21]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 5,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Cell Biology Lab (IB Block - First Floor)",
        building: buildings[21]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 4,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Microbiology Lab (IB Block - First Floor)",
        building: buildings[21]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 22,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Chemical Engineering Lab (IB Block - First Floor)",
        building: buildings[21]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 21,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Bio Process Lab (IB Block - First Floor)",
        building: buildings[21]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 7,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Bio Separation Lab (IB Block - First Floor)",
        building: buildings[21]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 10,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Fume Head Room (IB Block - First Floor)",
        building: buildings[21]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 0,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Bio-Organic Chemistry Lab (IB Block - First Floor)",
        building: buildings[21]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 5,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Instrumental method of analysis Lab (IB Block - First Floor)",
        building: buildings[21]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 22,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Immunology Lab (IB Block - First Floor)",
        building: buildings[21]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 3,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 222 (IB Block - Second Floor)",
        building: buildings[21]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 4,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 223 (IB Block - Second Floor)",
        building: buildings[21]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 2,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 224 (IB Block - Second Floor)",
        building: buildings[21]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 1,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 225 (IB Block - Second Floor)",
        building: buildings[21]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 16,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 226 (IB Block - Second Floor)",
        building: buildings[21]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 14,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 227 (IB Block - Second Floor)",
        building: buildings[21]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 20,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Maths Faculty Hall - 6 (IB Block - Second Floor)",
        building: buildings[21]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 3,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Electronics and Instrumentation Engineering (IB rib 1 - Ground Floor)",
        building: buildings[22]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 2,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall (IB rib 1 - Ground Floor)",
        building: buildings[22]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 8,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Yoga Centre (IB rib 1 - Ground Floor)",
        building: buildings[22]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 2,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 113 (IB rib 1 - First Floor)",
        building: buildings[22]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 24,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 114 (IB rib 1 - First Floor)",
        building: buildings[22]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 21,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 115 (IB rib 1 - First Floor)",
        building: buildings[22]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 18,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 212 (IB rib 1 - Second Floor)",
        building: buildings[22]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 0,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 211 (IB rib 1 - Second Floor)",
        building: buildings[22]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 6,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Technology Business Incubator - BIT TBI (IB rib 2 - Ground Floor)",
        building: buildings[23]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 23,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ß,α cave (IB rib 2 - Ground Floor)",
        building: buildings[23]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 4,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Repository (IB rib 2 - Ground Floor)",
        building: buildings[23]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 8,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Idea Pad (IB rib 2 - First Floor)",
        building: buildings[23]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 17,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Mission Control (IB rib 2 - First Floor)",
        building: buildings[23]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 4,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Pageant Theatre (IB rib 2 - First Floor)",
        building: buildings[23]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 2,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Proto Lounge (IB rib 2 - First Floor)",
        building: buildings[23]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 19,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Fab Lab (IB rib 2 - Second Floor)",
        building: buildings[23]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 5,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Venture Space (IB rib 2 - Second Floor)",
        building: buildings[23]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 20,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Mentor Studio (IB rib 2 - Second Floor)",
        building: buildings[23]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 20,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Launch Pad (IB rib 2 - Second Floor)",
        building: buildings[23]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 16,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Artificial Intelligence and Data Science (IB rib 3 - Ground Floor)",
        building: buildings[24]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 23,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CT & AIDS Library (IB rib 3 - Ground Floor)",
        building: buildings[24]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 0,
        category: "Library Rooms",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "MNC (IB rib 3 - Ground Floor)",
        building: buildings[24]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 15,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 117 (IB rib 3 - First Floor)",
        building: buildings[24]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 3,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 118 (IB rib 3 - First Floor)",
        building: buildings[24]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 7,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CT Faculty Hall 4 (IB rib 3 - First Floor)",
        building: buildings[24]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 6,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 213 (IB rib 3 - Second Floor)",
        building: buildings[24]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 14,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 214 (IB rib 3 - Second Floor)",
        building: buildings[24]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 13,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 215 (IB rib 3 - Second Floor)",
        building: buildings[24]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 1,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Centre of Excellence in Industrial Automation (IB rib 4 - Ground Floor)",
        building: buildings[25]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 4,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Internet of Things Lab (IB rib 4 - Ground Floor)",
        building: buildings[25]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 6,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "ZSN Computech (IB rib 4 - Ground Floor)",
        building: buildings[25]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 20,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "E-yantra Robotics Lab (IB rib 4 - Ground Floor)",
        building: buildings[25]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 19,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Computer Technology (IB rib 4 - First Floor)",
        building: buildings[25]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 9,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "CT Labs (IB rib 4 - First Floor)",
        building: buildings[25]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 4,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Artificial Intelligence and Data Science (IB rib 4 - Second Floor)",
        building: buildings[25]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 3,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "AIDS Labs (IB rib 4 - Second Floor)",
        building: buildings[25]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 14,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Electrical and Electronics Engineering (IB rib 5 - Ground Floor)",
        building: buildings[26]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 21,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall (IB rib 5 - Ground Floor)",
        building: buildings[26]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 4,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EEE Seminar Hall (IB rib 5 - Ground Floor)",
        building: buildings[26]._id,
        floor: 1,
        capacity: 75,
        availability: true,
        currentOccupancy: 21,
        category: "Seminar Hall",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 107 (IB rib 5 - First Floor)",
        building: buildings[26]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 20,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 108 (IB rib 5 - First Floor)",
        building: buildings[26]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 3,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 109 (IB rib 5 - First Floor)",
        building: buildings[26]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 7,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 207 (IB rib 5 - Second Floor)",
        building: buildings[26]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 16,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 206 (IB rib 5 - Second Floor)",
        building: buildings[26]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 21,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EIE Computer Centre (IB rib 6 - Ground Floor)",
        building: buildings[27]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 24,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Process Control Lab (IB rib 6 - Ground Floor)",
        building: buildings[27]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 3,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Sensor and Transducer Lab (IB rib 6 - First Floor)",
        building: buildings[27]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 19,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Industrial Instrumentation Lab (IB rib 6 - First Floor)",
        building: buildings[27]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 1,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Electronics Lab (IB rib 6 - First Floor)",
        building: buildings[27]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 4,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Conference Hall - EIE (IB rib 6 - Second Floor)",
        building: buildings[27]._id,
        floor: 3,
        capacity: 75,
        availability: true,
        currentOccupancy: 18,
        category: "Seminar Hall",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Smart Class Room - EIE (IB rib 6 - Second Floor)",
        building: buildings[27]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 18,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall (IB rib 7 - Ground Floor)",
        building: buildings[28]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 7,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 110 (IB rib 7 - First Floor)",
        building: buildings[28]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 5,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 111 (IB rib 7 - First Floor)",
        building: buildings[28]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 3,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 112 (IB rib 7 - First Floor)",
        building: buildings[28]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 4,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 208 (IB rib 7 - Second Floor)",
        building: buildings[28]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 8,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 209 (IB rib 7 - Second Floor)",
        building: buildings[28]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 5,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 210 (IB rib 7 - Second Floor)",
        building: buildings[28]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 6,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "BIT - Gurugualam (IB rib 8 - Ground Floor)",
        building: buildings[29]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 5,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Electronics Lab (IB rib 8 - Ground Floor)",
        building: buildings[29]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 24,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Electronics Machines Lab (IB rib 8 - Ground Floor)",
        building: buildings[29]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 2,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall (IB rib 8 - First Floor)",
        building: buildings[29]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 8,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Power Electronics and Drives Lab (IB rib 8 - Second Floor)",
        building: buildings[29]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 19,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Xerox printout (IB rib 9 - Ground Floor)",
        building: buildings[30]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 13,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Seminar Hall Mech (IB rib 9 - Ground Floor)",
        building: buildings[30]._id,
        floor: 1,
        capacity: 75,
        availability: true,
        currentOccupancy: 7,
        category: "Seminar Hall",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 101 (IB rib 9 - First Floor)",
        building: buildings[30]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 11,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 102 (IB rib 9 - First Floor)",
        building: buildings[30]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 10,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 103 (IB rib 9 - First Floor)",
        building: buildings[30]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 15,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 201 (IB rib 9 - Second Floor)",
        building: buildings[30]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 1,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 202 (IB rib 9 - Second Floor)",
        building: buildings[30]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 13,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "BIT Gurugualam (IB rib 10 - Ground Floor)",
        building: buildings[31]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 2,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Faculty Hall (IB rib 10 - First Floor)",
        building: buildings[31]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 0,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EEE Computer Centre (IB rib 10 - First Floor)",
        building: buildings[31]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 5,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Store Room (IB rib 10 - Second Floor)",
        building: buildings[31]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 23,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "EEE Tutorial Hall (IB rib 10 - Second Floor)",
        building: buildings[31]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 0,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Humanities (IB rib 11 - Ground Floor)",
        building: buildings[32]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 4,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Chairman Cabin (IB rib 11 - Ground Floor)",
        building: buildings[32]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 10,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 104 💝 (IB rib 11 - First Floor)",
        building: buildings[32]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 18,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 105 (IB rib 11 - First Floor)",
        building: buildings[32]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 8,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 106 (IB rib 11 - First Floor)",
        building: buildings[32]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 0,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 203 (IB rib 11 - Second Floor)",
        building: buildings[32]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 9,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 204 (IB rib 11 - Second Floor)",
        building: buildings[32]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 4,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "WW 205 (IB rib 11 - Second Floor)",
        building: buildings[32]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 24,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "BIT Gurugualam (IB rib 12 - Ground Floor)",
        building: buildings[33]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 24,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Wielding and pm lab (IB rib 12 - Ground Floor)",
        building: buildings[33]._id,
        floor: 1,
        capacity: 45,
        availability: true,
        currentOccupancy: 16,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Home Appliances Lab (IB rib 12 - First Floor)",
        building: buildings[33]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 18,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Salzar BIT Innovation Centre (IB rib 12 - First Floor)",
        building: buildings[33]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 11,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Basic EEE Lab (IB rib 12 - First Floor)",
        building: buildings[33]._id,
        floor: 2,
        capacity: 45,
        availability: true,
        currentOccupancy: 23,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "PLC Lab (IB rib 12 - Second Floor)",
        building: buildings[33]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 21,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "A&D Lab (IB rib 12 - Second Floor)",
        building: buildings[33]._id,
        floor: 3,
        capacity: 45,
        availability: true,
        currentOccupancy: 17,
        category: "Labs",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Thermal Drawing Hall (IB rib 12 - Second Floor)",
        building: buildings[33]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 23,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Internet Centre (Internet Centre - Ground Floor)",
        building: buildings[34]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 15,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Controller of Examination (COE) (Internet Centre - First Floor)",
        building: buildings[34]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 17,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Department of Training and Placement (Placement and Training Cell - Ground Floor)",
        building: buildings[35]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 12,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Vedhanayagam Auditorium (Placement and Training Cell - First Floor)",
        building: buildings[35]._id,
        floor: 2,
        capacity: 1500,
        availability: true,
        currentOccupancy: 11,
        category: "Auditorium",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Hostel Manager Cabin (Gym - Ground Floor)",
        building: buildings[36]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 19,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Boys Gym (Gym - First Floor)",
        building: buildings[36]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 11,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Yoga Centre (Gym - Second Floor)",
        building: buildings[36]._id,
        floor: 3,
        capacity: 60,
        availability: true,
        currentOccupancy: 22,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Boys Visitor Hall (Visitor hall (Boys) - Ground Floor)",
        building: buildings[37]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 13,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Conventional Store (Recreation Hall - Ground Floor)",
        building: buildings[38]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 14,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Gift Shop (Recreation Hall - Ground Floor)",
        building: buildings[38]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 15,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Mobile Shop (Recreation Hall - Ground Floor)",
        building: buildings[38]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 17,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Recreation Hall (Recreation Hall - First Floor)",
        building: buildings[38]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 7,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Mess (Mess - Ground Floor)",
        building: buildings[39]._id,
        floor: 1,
        capacity: 60,
        availability: true,
        currentOccupancy: 18,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Dance Hall (Mess - First Floor)",
        building: buildings[39]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 20,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Girls Gym (Mess - First Floor)",
        building: buildings[39]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 17,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      },
      {
        roomNumber: "Mess (Mess - First Floor)",
        building: buildings[39]._id,
        floor: 2,
        capacity: 60,
        availability: true,
        currentOccupancy: 17,
        category: "Classroom",
        facilities: ["Smart Board","Air Conditioning","Dual Projectors","WiFi 6"]
      }
    ]);

    console.log('[Seed] Inserting seed Assets...');
    const assets = await Asset.insertMany([
      {
        assetName: 'Apple MacBook Pro M3 Max Lab Unit',
        category: 'Electronics',
        status: 'Available',
        location: 'SF Block Floor 2, Room SF-201',
        building: buildings[0]._id,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600',
        availability: true,
        serialNumber: 'SN-MAC-2026-001'
      },
      {
        assetName: 'Meta Quest 3 VR Development Headset',
        category: 'VR Headset',
        status: 'Available',
        location: 'Innovation Lab SF-102',
        building: buildings[0]._id,
        image: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?auto=format&fit=crop&q=80&w=600',
        availability: true,
        serialNumber: 'SN-VRQ3-2026-882'
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
        room: rooms[0]._id,
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

    console.log('[Seed] Seed completed successfully!');
  } catch (error) {
    console.error('[Seed Error]', error);
  }
};

module.exports = seedDatabase;
