/**
 * Client-side Standalone RAG Engine & Offline Fallback
 * Grounded in campus_knowledge_base (10_rag_chunks_metadata.json - 428 Indexed Venues)
 */

export const CAMPUS_CHUNKS = [
  {
    "id": "chunk_001_campus_overview",
    "sourceFile": "01_campus_overview.md",
    "category": "General Information",
    "title": "Campus Overview, Geography & Gate Access",
    "buildingCode": null,
    "coordinates": {
      "latitude_center": 11.4965,
      "longitude_center": 77.2765
    },
    "keywords": [
      "location",
      "gates",
      "gate a",
      "gate c",
      "parking",
      "hours",
      "sathyamangalam",
      "coordinates"
    ],
    "text": "Bannari Amman Institute of Technology (BIT) is a premier 180-acre smart autonomous engineering campus situated in Sathyamangalam, Tamil Nadu. Main Gate A (BIT-GATE-A: 11.500344, 77.277934) serves as the primary 24/7 entrance with vehicle checkposts. Gate C (BIT-GATE-C: 11.493922, 77.273686) is the western entrance for sports arenas and west hostels (06:00 AM - 10:00 PM). Central parking (BIT-PRK: 11.498394, 77.278229) accommodates two-wheelers and four-wheelers with EV charging bays."
  },
  {
    "id": "chunk_002_emergency_safety",
    "sourceFile": "01_campus_overview.md",
    "category": "Emergency & Healthcare",
    "title": "Emergency SOS, Medical Center & Safety Hotlines",
    "buildingCode": null,
    "coordinates": null,
    "keywords": [
      "emergency",
      "sos",
      "ambulance",
      "doctor",
      "medical center",
      "phone",
      "extension",
      "hospital",
      "helpline",
      "security"
    ],
    "text": "Emergency assistance is available 24/7 across campus. Call internal extensions 6000/6111 or external line +91 (04295) 226000 for Security SOS. The BIT Medical Center (MED-CTR: 11.493860, 77.274593) provides round-the-clock doctors, 10-bed observation ward, in-house pharmacy, and a 24/7 ICU ambulance (Ext 6222/6223). The mobile app includes a one-touch Emergency SOS button that broadcasts GPS coordinates."
  },
  {
    "id": "chunk_003_sf_block_computing",
    "sourceFile": "02_buildings_directory.md",
    "category": "Academic Buildings",
    "title": "SF Academic Block - IT, Computer Science & AI Labs",
    "buildingCode": "SF-BLK",
    "coordinates": {
      "latitude": 11.4964,
      "longitude": 77.278644
    },
    "keywords": [
      "sf block",
      "ai lab",
      "computer science",
      "information technology",
      "data science",
      "cyber security",
      "it classrooms"
    ],
    "text": "The SF Academic Block (SF-BLK) is a 5-story computing hub. Base Floor contains Smart Classrooms IT 001-003 and the IT Seminar Hall. Floor 1 (Ground Floor) houses IT 101, IT 102, the IT Department Office, the Artificial Intelligence Lab (AI Lab) with GPU clusters, and the Data Science Lab. Floor 2 houses IT 201-205, Full Stack Dev Lab, and Cyber Security Lab. Floor 3 houses IT 301-305, Mobile App & AR/VR Lab, and the SF Conference Room."
  },
  {
    "id": "chunk_004_ib_block_core_eng",
    "sourceFile": "02_buildings_directory.md",
    "category": "Academic Buildings",
    "title": "IB Academic Block - Main Wing & East Wing",
    "buildingCode": "IB-BLK-MAIN",
    "coordinates": {
      "latitude": 11.494307,
      "longitude": 77.276529
    },
    "keywords": [
      "ib block",
      "lecture halls",
      "classes 101-125",
      "classes 201-225",
      "electrical",
      "electronics",
      "ece",
      "eee",
      "vlsi"
    ],
    "text": "The Institution Building (IB Block) features two primary wings. The Main Wing (IB-BLK-MAIN) houses Classrooms 101-117 on Floor 1, Classrooms 201-217 on Floor 2, Classrooms 301-317 on Floor 3, Dean Offices, and Power Electronics Labs. The East Wing (IB-BLK-EAST: 11.496902, 77.276419) houses Classrooms 118-125, 218-225, 318-325, VLSI Design Center, Embedded Systems Lab, and DSP Lab."
  },
  {
    "id": "chunk_005_specialized_academic_blocks",
    "sourceFile": "02_buildings_directory.md",
    "category": "Academic Buildings",
    "title": "Aeronautical, Mechanical & Applied Science Blocks",
    "buildingCode": null,
    "coordinates": null,
    "keywords": [
      "aeronautical",
      "mechanical",
      "as block",
      "wind tunnel",
      "robotics",
      "cnc",
      "flight simulator",
      "chemistry",
      "physics"
    ],
    "text": "Aeronautical Block (AERO-BLK: 11.497688, 77.278240, 4 floors) features supersonic wind tunnel labs, flight simulator pods, and avionics studios. Mechanical Block (MECH-BLK: 11.495788, 77.278523, 4 floors) houses CNC workshops, industrial robotics cells, and thermal fluid labs. AS Block (AS-BLK: 11.494401, 77.277540, 4 floors) houses Mathematics, Physics Labs, Chemistry Labs, and Language & Communication Centers."
  },
  {
    "id": "chunk_006_library_learning_center",
    "sourceFile": "02_buildings_directory.md",
    "category": "Library & Auditorium",
    "title": "BIT Central Learning Center & Vedhanayagam Auditorium",
    "buildingCode": null,
    "coordinates": null,
    "keywords": [
      "library",
      "learning center",
      "books",
      "study pods",
      "auditorium",
      "vedhanayagam",
      "convocation",
      "research"
    ],
    "text": "BIT Learning Center (LRN-CTR: 11.494200, 77.277162, 4 floors) is open 07:00 AM - 11:00 PM daily with 150,000+ volumes, IEEE digital access, reading halls, private study carrels, and collaboration pods. Vedhanayagam Auditorium (VEDHA-AUD: 11.494976, 77.277006) is a 2,500-seat grand convention hall equipped with line-array acoustics and 4K video projection for convocations and hackathons."
  },
  {
    "id": "chunk_007_hostels_and_dining",
    "sourceFile": "04_facilities_and_amenities.md",
    "category": "Hostels & Dining",
    "title": "Boys & Girls Hostels, Guest House & Cafeteria",
    "buildingCode": null,
    "coordinates": null,
    "keywords": [
      "hostel",
      "boys hostel",
      "girls hostel",
      "mess",
      "cafeteria",
      "canteen",
      "food",
      "guest house",
      "curfew"
    ],
    "text": "Boys Hostel (BOYS-HST: 11.494169, 77.278633, 6 floors, curfew 09:30 PM) and Girls Hostel (GIRLS-HST: 11.493970, 77.275827, 5 floors, curfew 09:00 PM) offer secure accommodation with dining messes, gyms, and WiFi. Central Cafeteria (BIT-CAF: 11.493778, 77.277569, open 07:00 AM - 09:30 PM) provides South/North Indian food courts, bakery, and juice bars. BIT Guest House (GST-HOUSE: 11.499858, 77.278559) offers 32 VIP AC suites for visitors."
  },
  {
    "id": "chunk_008_sports_facilities",
    "sourceFile": "04_facilities_and_amenities.md",
    "category": "Sports & Recreation",
    "title": "Sports Complex, Cricket Ground, Track & Courts",
    "buildingCode": null,
    "coordinates": null,
    "keywords": [
      "sports",
      "cricket ground",
      "athletic track",
      "tennis",
      "handball",
      "badminton",
      "basketball",
      "gym"
    ],
    "text": "Campus sports infrastructure includes a 400m synthetic Athletic Track (ATHLETIC-CRT, 05:30 AM - 09:00 PM), standard turf Cricket Ground (CRICKET-GND, 06:00 AM - 07:00 PM), floodlit synthetic Tennis Courts (TENNIS-CRT), Handball Court (HANDBALL-CRT), outdoor Basketball & Volleyball Sports Arena (SPORTS-ARNA, 06:00 AM - 09:30 PM), and an Indoor Badminton Complex with 4 wooden courts (BADMINTON-CRT, 06:00 AM - 09:30 PM)."
  },
  {
    "id": "chunk_009_reserveable_tech_assets",
    "sourceFile": "05_asset_and_equipment_catalog.md",
    "category": "Assets & Equipment",
    "title": "High-Value Tech Assets, MacBooks, VR & Drones",
    "buildingCode": null,
    "coordinates": null,
    "keywords": [
      "assets",
      "macbook",
      "vr headset",
      "quest 3",
      "drone",
      "dji mavic",
      "3d printer",
      "projector",
      "equipment"
    ],
    "text": "Reserveable campus assets include: (1) Apple MacBook Pro M3 Max (SN-MAC-2026-001) in Computer Center B-204 for ML/iOS projects; (2) Meta Quest 3 VR Headset (SN-VRQ3-2026-882) in Innovation Lab A-102 for spatial simulation; (3) DJI Mavic 3 Pro Survey Drone (SN-DJI-DRONE-991) in GIS Center for photogrammetry; (4) Ender 3 Pro 3D Printer (SN-3DP-2026-302) in Maker Studio B-105; and (5) Epson 4K Laser Projector (SN-PRJ-2026-092) in Library Pod 204."
  },
  {
    "id": "chunk_010_booking_sops_and_qr_passes",
    "sourceFile": "06_booking_and_reservation_rules.md",
    "category": "Booking Rules & SOPs",
    "title": "Facility Booking, QR Access Passes & Check-in Rules",
    "buildingCode": null,
    "coordinates": null,
    "keywords": [
      "booking rules",
      "qr code",
      "digital pass",
      "check in",
      "grace period",
      "cancellation",
      "permissions",
      "no show"
    ],
    "text": "Facility and asset bookings generate an instant encrypted QR Digital Access Pass. Users must scan their QR code at the room door reader or lab desk within a 15-minute grace period; failing to check in results in auto-cancellation as 'No-Show' to prevent ghost bookings. Cancellations are free up to 30 minutes prior. Students can have up to 2 active bookings, faculty up to 5."
  },
  {
    "id": "chunk_011_dijkstra_navigation_engine",
    "sourceFile": "07_navigation_and_gis_routing.md",
    "category": "Navigation & GIS",
    "title": "Dijkstra Road Routing, 320 Junctions & Dual Modes",
    "buildingCode": null,
    "coordinates": null,
    "keywords": [
      "dijkstra",
      "navigation engine",
      "routing",
      "road junctions",
      "walk mode",
      "drive mode",
      "gps",
      "wheelchair"
    ],
    "text": "The campus navigation engine uses Dijkstra's algorithm across 320 calibrated road junctions to generate strict road paths that avoid building collisions. Walk Mode utilizes pedestrian avenues and walkways at 4.5 km/h with wheelchair ramp filtering. Drive Mode routes vehicles strictly on vehicular asphalt ring roads at 20 km/h and directs drivers to the nearest parking bay. Live GPS marker syncs with real-time Socket.IO telemetry."
  },
  {
    "id": "chunk_012_events_and_competitions",
    "sourceFile": "08_events_and_campus_life.md",
    "category": "Events & Highlights",
    "title": "Hackathons, Symposia, Sports League & Clubs",
    "buildingCode": null,
    "coordinates": null,
    "keywords": [
      "events",
      "hackathon",
      "symposium",
      "sports league",
      "gdsc",
      "robotics club",
      "bit code"
    ],
    "text": "Major recurring campus events include: National Smart Campus Hackathon 2026 (Sep 05-07, Main Auditorium & SF Labs, 350+ attendees), AI & Robotics Symposium (Sep 12, IB Seminar Hall II, 180+ delegates), and BIT Inter-College Sports League (Sep 18-21, Sports Complex, 500+ athletes). Active student clubs include Google Developer Student Club (GDSC), Robotics & Automation Society (RAS), and Coding Guild."
  },
  {
    "id": "chunk_013_as_main_left_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "AS Block (AS-MAIN-LEFT) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "AS-MAIN-LEFT",
    "coordinates": {
      "latitude": 11.4956,
      "longitude": 77.2769
    },
    "keywords": [
      "as block",
      "as-main-left",
      "cs",
      "109",
      "as",
      "block",
      "ground",
      "floor",
      "cs109",
      "cs 109",
      "new",
      "product",
      "development",
      "lab",
      "110",
      "cs110",
      "cs 110",
      "digital",
      "marketing",
      "111",
      "cs111",
      "cs 111",
      "research",
      "112",
      "cs112",
      "cs 112",
      "test",
      "and",
      "repair",
      "centre",
      "industrial",
      "design",
      "studio",
      "it",
      "operations",
      "department",
      "of",
      "information",
      "science",
      "technology",
      "first",
      "ise",
      "server",
      "room",
      "faculty"
    ],
    "text": "AS Block (Building Code: AS-MAIN-LEFT) houses 29 academic venues, classrooms, and laboratories:\n\n• 1st Floor: CS 109 (AS Block - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: New Product Development Lab (CS 110) (AS Block - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Digital Marketing Lab (CS 111) (AS Block - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Research Lab (CS 112) (AS Block - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Test and Repair Centre (AS Block - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Industrial Design Studio (AS Block - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: IT Operations (AS Block - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Department of Information Science and Technology (AS Block - First floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: ISE Lab 1 (AS Block - First floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: ISE Lab 2 (AS Block - First floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Server Room (AS Block - First floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Faculty Hall 1 (AS Block - First floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Robotics & Automation Lab (AS Block - First floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: BT Lab (AS Block - First floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Discussion Room (AS Block - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Conference Room (AS Block - Second Floor) - [Category: Seminar Hall, Capacity: 75 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Data Science Lab (AS Block - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Open Source Lab (AS Block - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: AR/VR Lab (AS Block - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Design & Prototyping Lab (AS Block - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Hackathon Lab (AS Block - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Integrated AI Lab (AS Block - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Sensor Lab (AS Block - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Vision Engineering Lab (AS Block - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Embedded Systems Lab (AS Block - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: UAV Lab (AS Block - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: UUV Lab (AS Block - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Robotics Lab (AS Block - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Automation Lab (AS Block - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_014_as_rib_1_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "AS rib 1 (AS-RIB-1) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "AS-RIB-1",
    "coordinates": {
      "latitude": 11.4954,
      "longitude": 77.2771
    },
    "keywords": [
      "as rib 1",
      "as-rib-1",
      "department",
      "of",
      "biomedical",
      "engineering",
      "as",
      "rib",
      "ground",
      "floor",
      "faculty",
      "hall",
      "ew",
      "113",
      "first",
      "ew113",
      "ew 113",
      "114",
      "ew114",
      "ew 114",
      "115",
      "ew115",
      "ew 115",
      "213",
      "second",
      "ew213",
      "ew 213",
      "214",
      "ew214",
      "ew 214",
      "215",
      "ew215",
      "ew 215"
    ],
    "text": "AS rib 1 (Building Code: AS-RIB-1) houses 8 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Department of Biomedical Engineering (AS rib 1 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Faculty Hall (AS rib 1 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: EW 113 (AS rib 1 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: EW 114 (AS rib 1 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: EW 115 (AS rib 1 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: EW 213 (AS rib 1 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: EW 214 (AS rib 1 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: EW 215 (AS rib 1 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_015_as_rib_10_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "AS rib 10 (AS-RIB-10) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "AS-RIB-10",
    "coordinates": {
      "latitude": 11.4945,
      "longitude": 77.278
    },
    "keywords": [
      "as rib 10",
      "as-rib-10",
      "chemical",
      "processing",
      "lab",
      "as",
      "rib",
      "10",
      "ground",
      "floor",
      "rib10",
      "rib 10",
      "apparel",
      "testing",
      "first",
      "textile",
      "faculty",
      "hall",
      "vlsi",
      "design",
      "second",
      "digital",
      "electronic",
      "microprocessor",
      "microcontroller"
    ],
    "text": "AS rib 10 (Building Code: AS-RIB-10) houses 7 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Chemical Processing Lab (AS rib 10 - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Apparel Testing Lab (AS rib 10 - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Textile Testing Lab (AS rib 10 - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Faculty Hall (AS rib 10 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: VLSI Design Lab (AS rib 10 - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Digital Electronic Lab (AS rib 10 - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Microprocessor & Microcontroller Lab (AS rib 10 - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_016_as_rib_11_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "AS rib 11 (AS-RIB-11) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "AS-RIB-11",
    "coordinates": {
      "latitude": 11.4944,
      "longitude": 77.2781
    },
    "keywords": [
      "as rib 11",
      "as-rib-11",
      "department",
      "of",
      "textile",
      "technology",
      "as",
      "rib",
      "11",
      "ground",
      "floor",
      "rib11",
      "rib 11",
      "faculty",
      "hall",
      "seminar",
      "ew",
      "104",
      "first",
      "ew104",
      "ew 104",
      "105",
      "ew105",
      "ew 105",
      "106",
      "ew106",
      "ew 106",
      "204",
      "second",
      "ew204",
      "ew 204",
      "205",
      "ew205",
      "ew 205",
      "206",
      "ew206",
      "ew 206"
    ],
    "text": "AS rib 11 (Building Code: AS-RIB-11) houses 9 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Department of Textile Technology (AS rib 11 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Faculty Hall (AS rib 11 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Textile Seminar Hall (AS rib 11 - Ground Floor) - [Category: Seminar Hall, Capacity: 75 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: EW 104 (AS rib 11 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: EW 105 (AS rib 11 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: EW 106 (AS rib 11 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: EW 204 (AS rib 11 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: EW 205 (AS rib 11 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: EW 206 (AS rib 11 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_017_as_rib_12_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "AS rib 12 (AS-RIB-12) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "AS-RIB-12",
    "coordinates": {
      "latitude": 11.4943,
      "longitude": 77.2782
    },
    "keywords": [
      "as rib 12",
      "as-rib-12",
      "weaving",
      "and",
      "knitting",
      "lab",
      "as",
      "rib",
      "12",
      "ground",
      "floor",
      "rib12",
      "rib 12",
      "food",
      "technology",
      "first",
      "analysis",
      "instrumentation",
      "facility",
      "second"
    ],
    "text": "AS rib 12 (Building Code: AS-RIB-12) houses 4 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Weaving and Knitting Lab (AS rib 12 - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Food Technology Lab (AS rib 12 - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Food Analysis and Instrumentation Facility (AS rib 12 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Food Technology Lab - 2 (AS rib 12 - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_018_as_rib_2_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "AS rib 2 (AS-RIB-2) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "AS-RIB-2",
    "coordinates": {
      "latitude": 11.4953,
      "longitude": 77.2772
    },
    "keywords": [
      "as rib 2",
      "as-rib-2",
      "department",
      "of",
      "chemistry",
      "as",
      "rib",
      "ground",
      "floor",
      "faculty",
      "hall",
      "laboratory",
      "language",
      "lab",
      "first",
      "elcc",
      "cell",
      "physics",
      "second"
    ],
    "text": "AS rib 2 (Building Code: AS-RIB-2) houses 8 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Department of Chemistry (AS rib 2 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Faculty Hall (AS rib 2 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Chemistry Laboratory - 1 (AS rib 2 - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Language Lab (AS rib 2 - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: ELCC Cell (AS rib 2 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Faculty Hall (AS rib 2 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Physics Laboratory - 1 (AS rib 2 - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Faculty Hall (AS rib 2 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_019_as_rib_3_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "AS rib 3 (AS-RIB-3) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "AS-RIB-3",
    "coordinates": {
      "latitude": 11.4952,
      "longitude": 77.2773
    },
    "keywords": [
      "as rib 3",
      "as-rib-3",
      "department",
      "of",
      "civil",
      "engineering",
      "as",
      "rib",
      "ground",
      "floor",
      "faculty",
      "hall",
      "conference",
      "ew",
      "116",
      "first",
      "ew116",
      "ew 116",
      "117",
      "ew117",
      "ew 117",
      "118",
      "ew118",
      "ew 118",
      "216",
      "second",
      "ew216",
      "ew 216",
      "217",
      "ew217",
      "ew 217",
      "218",
      "ew218",
      "ew 218"
    ],
    "text": "AS rib 3 (Building Code: AS-RIB-3) houses 9 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Department of Civil Engineering (AS rib 3 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Faculty Hall (AS rib 3 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Conference Hall (AS rib 3 - Ground Floor) - [Category: Seminar Hall, Capacity: 75 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: EW 116 (AS rib 3 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: EW 117 (AS rib 3 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: EW 118 (AS rib 3 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: EW 216 (AS rib 3 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: EW 217 (AS rib 3 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: EW 218 (AS rib 3 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_020_as_rib_4_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "AS rib 4 (AS-RIB-4) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "AS-RIB-4",
    "coordinates": {
      "latitude": 11.4951,
      "longitude": 77.2774
    },
    "keywords": [
      "as rib 4",
      "as-rib-4",
      "faculty",
      "hall",
      "as",
      "rib",
      "ground",
      "floor",
      "signal",
      "processing",
      "lab",
      "pcb",
      "design",
      "fabrication",
      "department",
      "of",
      "physics",
      "first",
      "laboratory",
      "chemistry",
      "second"
    ],
    "text": "AS rib 4 (Building Code: AS-RIB-4) houses 9 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Faculty Hall (AS rib 4 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Signal Processing Lab (AS rib 4 - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: PCB Design Lab (AS rib 4 - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: PCB Fabrication Lab (AS rib 4 - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Department of Physics (AS rib 4 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Physics Laboratory - 2 (AS rib 4 - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Faculty  Hall (AS rib 4 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Chemistry Laboratory - 2 (AS rib 4 - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Faculty Hall (AS rib 4 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_021_as_rib_5_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "AS rib 5 (AS-RIB-5) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "AS-RIB-5",
    "coordinates": {
      "latitude": 11.495,
      "longitude": 77.2775
    },
    "keywords": [
      "as rib 5",
      "as-rib-5",
      "faculty",
      "hall",
      "as",
      "rib",
      "ground",
      "floor",
      "ew",
      "107",
      "first",
      "ew107",
      "ew 107",
      "108",
      "ew108",
      "ew 108",
      "109",
      "ew109",
      "ew 109",
      "207",
      "second",
      "ew207",
      "ew 207",
      "208",
      "ew208",
      "ew 208",
      "209",
      "ew209",
      "ew 209"
    ],
    "text": "AS rib 5 (Building Code: AS-RIB-5) houses 7 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Faculty Hall 2 (AS rib 5 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: EW 107 (AS rib 5 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: EW 108 ❤️‍🩹 (AS rib 5 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: EW 109 (AS rib 5 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: EW 207 (AS rib 5 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: EW 208 (AS rib 5 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: EW 209 (AS rib 5 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_022_as_rib_6_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "AS rib 6 (AS-RIB-6) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "AS-RIB-6",
    "coordinates": {
      "latitude": 11.4949,
      "longitude": 77.2776
    },
    "keywords": [
      "as rib 6",
      "as-rib-6",
      "faculty",
      "hall",
      "as",
      "rib",
      "ground",
      "floor",
      "soil",
      "mechanic",
      "lab",
      "cadd",
      "survey",
      "first",
      "environmental",
      "biochemistry",
      "second",
      "physiology"
    ],
    "text": "AS rib 6 (Building Code: AS-RIB-6) houses 6 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Faculty Hall (AS rib 6 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Soil Mechanic Lab (AS rib 6 - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: CADD & Survey Lab (AS rib 6 - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Survey & Environmental Lab (AS rib 6 - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Biochemistry Lab (AS rib 6 - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Physiology Lab (AS rib 6 - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_023_as_rib_7_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "AS rib 7 (AS-RIB-7) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "AS-RIB-7",
    "coordinates": {
      "latitude": 11.4948,
      "longitude": 77.2777
    },
    "keywords": [
      "as rib 7",
      "as-rib-7",
      "department",
      "of",
      "electrical",
      "and",
      "communication",
      "engineering",
      "as",
      "rib",
      "ground",
      "floor",
      "faculty",
      "hall",
      "ece",
      "seminar",
      "first",
      "ew",
      "111",
      "ew111",
      "ew 111",
      "112",
      "ew112",
      "ew 112",
      "210",
      "second",
      "ew210",
      "ew 210",
      "211",
      "ew211",
      "ew 211",
      "212",
      "ew212",
      "ew 212"
    ],
    "text": "AS rib 7 (Building Code: AS-RIB-7) houses 9 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Department of Electrical and Communication Engineering (AS rib 7 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Faculty Hall 1 (AS rib 7 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: ECE Seminar Hall (AS rib 7 - Ground Floor) - [Category: Seminar Hall, Capacity: 75 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Faculty Hall 3 (AS rib 7 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: EW 111 (AS rib 7 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: EW 112 (AS rib 7 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: EW 210 (AS rib 7 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: EW 211 (AS rib 7 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: EW 212 (AS rib 7 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_024_as_rib_8_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "AS rib 8 (AS-RIB-8) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "AS-RIB-8",
    "coordinates": {
      "latitude": 11.4947,
      "longitude": 77.2778
    },
    "keywords": [
      "as rib 8",
      "as-rib-8",
      "analog",
      "electronic",
      "ic",
      "lab",
      "as",
      "rib",
      "ground",
      "floor",
      "advanced",
      "communication",
      "system",
      "network",
      "first",
      "pg",
      "vlsi",
      "product",
      "development",
      "digital",
      "second",
      "microwave",
      "optical"
    ],
    "text": "AS rib 8 (Building Code: AS-RIB-8) houses 7 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Analog electronic & IC Lab (AS rib 8 - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Advanced Communication System Lab (AS rib 8 - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Network Lab (AS rib 8 - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: PG VLSI Lab (AS rib 8 - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Product Development Lab (AS rib 8 - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Analog & Digital Lab (AS rib 8 - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Microwave & Optical Lab (AS rib 8 - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_025_as_rib_9_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "AS rib 9 (AS-RIB-9) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "AS-RIB-9",
    "coordinates": {
      "latitude": 11.4946,
      "longitude": 77.2779
    },
    "keywords": [
      "as rib 9",
      "as-rib-9",
      "department",
      "of",
      "food",
      "technology",
      "as",
      "rib",
      "ground",
      "floor",
      "faculty",
      "hall",
      "ew",
      "101",
      "first",
      "ew101",
      "ew 101",
      "102",
      "ew102",
      "ew 102",
      "103",
      "ew103",
      "ew 103",
      "201",
      "second",
      "ew201",
      "ew 201",
      "202",
      "ew202",
      "ew 202",
      "203",
      "ew203",
      "ew 203"
    ],
    "text": "AS rib 9 (Building Code: AS-RIB-9) houses 8 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Department of Food Technology (AS rib 9 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Faculty Hall (AS rib 9 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: EW 101 (AS rib 9 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: EW 102 (AS rib 9 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: EW 103 (AS rib 9 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: EW 201 (AS rib 9 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: EW 202 (AS rib 9 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: EW 203 (AS rib 9 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_026_fashion_centre_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "Fashion Resource Centre (FASHION-CENTRE) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "FASHION-CENTRE",
    "coordinates": {
      "latitude": 11.4942,
      "longitude": 77.2783
    },
    "keywords": [
      "fashion resource centre",
      "fashion-centre",
      "department",
      "of",
      "fashion",
      "technology",
      "resource",
      "centre",
      "ground",
      "floor",
      "faculty",
      "hall",
      "class",
      "rooms",
      "first",
      "garment",
      "construction",
      "lab"
    ],
    "text": "Fashion Resource Centre (Building Code: FASHION-CENTRE) houses 5 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Department of Fashion Technology (Fashion Resource Centre - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Faculty Hall (Fashion Resource Centre - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Class rooms (Fashion Resource Centre - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Garment Construction Lab 1 (Fashion Resource Centre - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Garment Construction Lab 2 (Fashion Resource Centre - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_027_indoor_gym_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "Gym (INDOOR-GYM) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "INDOOR-GYM",
    "coordinates": {
      "latitude": 11.4924,
      "longitude": 77.2801
    },
    "keywords": [
      "gym",
      "indoor-gym",
      "hostel",
      "manager",
      "cabin",
      "ground",
      "floor",
      "boys",
      "first",
      "yoga",
      "centre",
      "second"
    ],
    "text": "Gym (Building Code: INDOOR-GYM) houses 3 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Hostel Manager Cabin (Gym - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Boys Gym (Gym - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Yoga Centre (Gym - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_028_ib_block_2_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "IB Block (IB-BLOCK-2) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "IB-BLOCK-2",
    "coordinates": {
      "latitude": 11.4939,
      "longitude": 77.2786
    },
    "keywords": [
      "ib block",
      "ib-block-2",
      "department",
      "of",
      "mathematics",
      "ib",
      "block",
      "ground",
      "floor",
      "101",
      "left",
      "as",
      "it",
      "is",
      "in",
      "remainder",
      "old",
      "names",
      "ib101",
      "ib 101",
      "ww",
      "002",
      "ww002",
      "ww 002",
      "003",
      "ww003",
      "ww 003",
      "004",
      "ww004",
      "ww 004",
      "maths",
      "faculty",
      "hall",
      "biotech",
      "seminar",
      "genetic",
      "engineering",
      "lab",
      "first",
      "molecular",
      "biology",
      "bio",
      "polymer",
      "material",
      "synthesis"
    ],
    "text": "IB Block (Building Code: IB-BLOCK-2) houses 54 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Department of Mathematics (IB Block - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: IB 101 (left as it is in remainder of old names) (IB Block - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: WW 002 (IB Block - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: WW 003 (IB Block - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: WW 004 (IB Block - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Maths Faculty Hall - 1 (IB Block - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Maths Faculty Hall - 2 (IB Block - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Biotech Seminar Hall (IB Block - Ground Floor) - [Category: Seminar Hall, Capacity: 75 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Genetic Engineering Lab (IB Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Molecular Biology Lab (IB Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Bio-polymer Lab (IB Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Bio Material Synthesis and Analysis Lab (IB Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Bio-prospecting Lab (IB Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Department of Bio-Technology (IB Block - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Plant Issue Culture Lab (IB Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Faculty Hall (IB Block - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 216 (IB Block - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 217 (IB Block - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 218 (IB Block - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 219 (IB Block - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 220 (IB Block - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 221 (IB Block - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Maths Faculty Hall - 5 (IB Block - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: WW 005 (IB Block - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: WW 006 (IB Block - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: WW 007 (IB Block - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: WW 008 (IB Block - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: WW 010 (IB Block - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: WW 011 (IB Block - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: WW 012 (IB Block - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Bio-process and Bio-product Lab (IB Block - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: BIT Integrated Plant Research Facility (IB Block - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Bio Energy Research Lab (IB Block - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Fungal Bio-diversity and Bio-resources Research Lab (IB Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Lecture Hall IB 118 (IB Block - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Nano Biotechnology Lab (IB Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Molecular Diagnostic and Bacterial Pathogenemis Lab (IB Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Downstream Processing Lab (IB Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Cell Biology Lab (IB Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Microbiology Lab (IB Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Chemical Engineering Lab (IB Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Bio Process Lab (IB Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Bio Separation Lab (IB Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Fume Head Room (IB Block - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Bio-Organic Chemistry Lab (IB Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Instrumental method of analysis Lab (IB Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Immunology Lab (IB Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 222 (IB Block - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 223 (IB Block - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 224 (IB Block - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 225 (IB Block - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 226 (IB Block - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 227 (IB Block - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Maths Faculty Hall - 6 (IB Block - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_029_ib_rib_1_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "IB rib 1 (IB-RIB-1) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "IB-RIB-1",
    "coordinates": {
      "latitude": 11.4938,
      "longitude": 77.2787
    },
    "keywords": [
      "ib rib 1",
      "ib-rib-1",
      "department",
      "of",
      "electronics",
      "and",
      "instrumentation",
      "engineering",
      "ib",
      "rib",
      "ground",
      "floor",
      "faculty",
      "hall",
      "yoga",
      "centre",
      "ww",
      "113",
      "first",
      "ww113",
      "ww 113",
      "114",
      "ww114",
      "ww 114",
      "115",
      "ww115",
      "ww 115",
      "212",
      "second",
      "ww212",
      "ww 212",
      "211",
      "ww211",
      "ww 211"
    ],
    "text": "IB rib 1 (Building Code: IB-RIB-1) houses 8 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Department of Electronics and Instrumentation Engineering (IB rib 1 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Faculty Hall (IB rib 1 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Yoga Centre (IB rib 1 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: WW 113 (IB rib 1 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: WW 114 (IB rib 1 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: WW 115 (IB rib 1 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 212 (IB rib 1 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 211 (IB rib 1 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_030_ib_rib_10_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "IB rib 10 (IB-RIB-10) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "IB-RIB-10",
    "coordinates": {
      "latitude": 11.4929,
      "longitude": 77.2796
    },
    "keywords": [
      "ib rib 10",
      "ib-rib-10",
      "bit",
      "gurugualam",
      "ib",
      "rib",
      "10",
      "ground",
      "floor",
      "rib10",
      "rib 10",
      "faculty",
      "hall",
      "first",
      "eee",
      "computer",
      "centre",
      "store",
      "room",
      "second",
      "tutorial"
    ],
    "text": "IB rib 10 (Building Code: IB-RIB-10) houses 5 academic venues, classrooms, and laboratories:\n\n• Ground Floor: BIT Gurugualam (IB rib 10 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Faculty Hall (IB rib 10 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: EEE Computer Centre (IB rib 10 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Store Room (IB rib 10 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: EEE Tutorial Hall (IB rib 10 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_031_ib_rib_11_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "IB rib 11 (IB-RIB-11) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "IB-RIB-11",
    "coordinates": {
      "latitude": 11.4928,
      "longitude": 77.2797
    },
    "keywords": [
      "ib rib 11",
      "ib-rib-11",
      "department",
      "of",
      "humanities",
      "ib",
      "rib",
      "11",
      "ground",
      "floor",
      "rib11",
      "rib 11",
      "chairman",
      "cabin",
      "ww",
      "104",
      "first",
      "ww104",
      "ww 104",
      "105",
      "ww105",
      "ww 105",
      "106",
      "ww106",
      "ww 106",
      "203",
      "second",
      "ww203",
      "ww 203",
      "204",
      "ww204",
      "ww 204",
      "205",
      "ww205",
      "ww 205"
    ],
    "text": "IB rib 11 (Building Code: IB-RIB-11) houses 8 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Department of Humanities (IB rib 11 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Chairman Cabin (IB rib 11 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: WW 104 💝 (IB rib 11 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: WW 105 (IB rib 11 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: WW 106 (IB rib 11 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 203 (IB rib 11 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 204 (IB rib 11 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 205 (IB rib 11 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_032_ib_rib_12_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "IB rib 12 (IB-RIB-12) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "IB-RIB-12",
    "coordinates": {
      "latitude": 11.4927,
      "longitude": 77.2798
    },
    "keywords": [
      "ib rib 12",
      "ib-rib-12",
      "bit",
      "gurugualam",
      "ib",
      "rib",
      "12",
      "ground",
      "floor",
      "rib12",
      "rib 12",
      "wielding",
      "and",
      "pm",
      "lab",
      "home",
      "appliances",
      "first",
      "salzar",
      "innovation",
      "centre",
      "basic",
      "eee",
      "plc",
      "second",
      "thermal",
      "drawing",
      "hall"
    ],
    "text": "IB rib 12 (Building Code: IB-RIB-12) houses 8 academic venues, classrooms, and laboratories:\n\n• Ground Floor: BIT Gurugualam (IB rib 12 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Wielding and pm lab (IB rib 12 - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Home Appliances Lab (IB rib 12 - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Salzar BIT Innovation Centre (IB rib 12 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Basic EEE Lab (IB rib 12 - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: PLC Lab (IB rib 12 - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: A&D Lab (IB rib 12 - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Thermal Drawing Hall (IB rib 12 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_033_ib_rib_2_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "IB rib 2 (IB-RIB-2) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "IB-RIB-2",
    "coordinates": {
      "latitude": 11.4937,
      "longitude": 77.2788
    },
    "keywords": [
      "ib rib 2",
      "ib-rib-2",
      "technology",
      "business",
      "incubator",
      "bit",
      "tbi",
      "ib",
      "rib",
      "ground",
      "floor",
      "cave",
      "repository",
      "idea",
      "pad",
      "first",
      "mission",
      "control",
      "pageant",
      "theatre",
      "proto",
      "lounge",
      "fab",
      "lab",
      "second",
      "venture",
      "space",
      "mentor",
      "studio",
      "launch"
    ],
    "text": "IB rib 2 (Building Code: IB-RIB-2) houses 11 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Technology Business Incubator - BIT TBI (IB rib 2 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: ß,α cave (IB rib 2 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Repository (IB rib 2 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Idea Pad (IB rib 2 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Mission Control (IB rib 2 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Pageant Theatre (IB rib 2 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Proto Lounge (IB rib 2 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Fab Lab (IB rib 2 - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Venture Space (IB rib 2 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Mentor Studio (IB rib 2 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Launch Pad (IB rib 2 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_034_ib_rib_3_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "IB rib 3 (IB-RIB-3) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "IB-RIB-3",
    "coordinates": {
      "latitude": 11.4936,
      "longitude": 77.2789
    },
    "keywords": [
      "ib rib 3",
      "ib-rib-3",
      "department",
      "of",
      "artificial",
      "intelligence",
      "and",
      "data",
      "science",
      "ib",
      "rib",
      "ground",
      "floor",
      "ct",
      "aids",
      "library",
      "mnc",
      "ww",
      "117",
      "first",
      "ww117",
      "ww 117",
      "118",
      "ww118",
      "ww 118",
      "faculty",
      "hall",
      "213",
      "second",
      "ww213",
      "ww 213",
      "214",
      "ww214",
      "ww 214",
      "215",
      "ww215",
      "ww 215"
    ],
    "text": "IB rib 3 (Building Code: IB-RIB-3) houses 9 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Department of Artificial Intelligence and Data Science (IB rib 3 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: CT & AIDS Library (IB rib 3 - Ground Floor) - [Category: Library Rooms, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: MNC (IB rib 3 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: WW 117 (IB rib 3 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: WW 118 (IB rib 3 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: CT Faculty Hall 4 (IB rib 3 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 213 (IB rib 3 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 214 (IB rib 3 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 215 (IB rib 3 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_035_ib_rib_4_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "IB rib 4 (IB-RIB-4) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "IB-RIB-4",
    "coordinates": {
      "latitude": 11.4935,
      "longitude": 77.279
    },
    "keywords": [
      "ib rib 4",
      "ib-rib-4",
      "centre",
      "of",
      "excellence",
      "in",
      "industrial",
      "automation",
      "ib",
      "rib",
      "ground",
      "floor",
      "internet",
      "things",
      "lab",
      "zsn",
      "computech",
      "yantra",
      "robotics",
      "department",
      "computer",
      "technology",
      "first",
      "ct",
      "labs",
      "artificial",
      "intelligence",
      "and",
      "data",
      "science",
      "second",
      "aids"
    ],
    "text": "IB rib 4 (Building Code: IB-RIB-4) houses 8 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Centre of Excellence in Industrial Automation (IB rib 4 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Internet of Things Lab (IB rib 4 - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: ZSN Computech (IB rib 4 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: E-yantra Robotics Lab (IB rib 4 - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Department of Computer Technology (IB rib 4 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: CT Labs (IB rib 4 - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Department of Artificial Intelligence and Data Science (IB rib 4 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: AIDS Labs (IB rib 4 - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_036_ib_rib_5_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "IB rib 5 (IB-RIB-5) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "IB-RIB-5",
    "coordinates": {
      "latitude": 11.4934,
      "longitude": 77.2791
    },
    "keywords": [
      "ib rib 5",
      "ib-rib-5",
      "department",
      "of",
      "electrical",
      "and",
      "electronics",
      "engineering",
      "ib",
      "rib",
      "ground",
      "floor",
      "faculty",
      "hall",
      "eee",
      "seminar",
      "ww",
      "107",
      "first",
      "ww107",
      "ww 107",
      "108",
      "ww108",
      "ww 108",
      "109",
      "ww109",
      "ww 109",
      "207",
      "second",
      "ww207",
      "ww 207",
      "206",
      "ww206",
      "ww 206"
    ],
    "text": "IB rib 5 (Building Code: IB-RIB-5) houses 8 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Department of Electrical and Electronics Engineering (IB rib 5 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Faculty Hall (IB rib 5 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: EEE Seminar Hall (IB rib 5 - Ground Floor) - [Category: Seminar Hall, Capacity: 75 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: WW 107 (IB rib 5 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: WW 108 (IB rib 5 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: WW 109 (IB rib 5 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 207 (IB rib 5 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 206 (IB rib 5 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_037_ib_rib_6_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "IB rib 6 (IB-RIB-6) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "IB-RIB-6",
    "coordinates": {
      "latitude": 11.4933,
      "longitude": 77.2792
    },
    "keywords": [
      "ib rib 6",
      "ib-rib-6",
      "eie",
      "computer",
      "centre",
      "ib",
      "rib",
      "ground",
      "floor",
      "process",
      "control",
      "lab",
      "sensor",
      "and",
      "transducer",
      "first",
      "industrial",
      "instrumentation",
      "electronics",
      "conference",
      "hall",
      "second",
      "smart",
      "class",
      "room"
    ],
    "text": "IB rib 6 (Building Code: IB-RIB-6) houses 7 academic venues, classrooms, and laboratories:\n\n• Ground Floor: EIE Computer Centre (IB rib 6 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Process Control Lab (IB rib 6 - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Sensor and Transducer Lab (IB rib 6 - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Industrial Instrumentation Lab (IB rib 6 - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Electronics Lab (IB rib 6 - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Conference Hall - EIE (IB rib 6 - Second Floor) - [Category: Seminar Hall, Capacity: 75 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Smart Class Room - EIE (IB rib 6 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_038_ib_rib_7_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "IB rib 7 (IB-RIB-7) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "IB-RIB-7",
    "coordinates": {
      "latitude": 11.4932,
      "longitude": 77.2793
    },
    "keywords": [
      "ib rib 7",
      "ib-rib-7",
      "faculty",
      "hall",
      "ib",
      "rib",
      "ground",
      "floor",
      "ww",
      "110",
      "first",
      "ww110",
      "ww 110",
      "111",
      "ww111",
      "ww 111",
      "112",
      "ww112",
      "ww 112",
      "208",
      "second",
      "ww208",
      "ww 208",
      "209",
      "ww209",
      "ww 209",
      "210",
      "ww210",
      "ww 210"
    ],
    "text": "IB rib 7 (Building Code: IB-RIB-7) houses 7 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Faculty Hall (IB rib 7 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: WW 110 (IB rib 7 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: WW 111 (IB rib 7 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: WW 112 (IB rib 7 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 208 (IB rib 7 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 209 (IB rib 7 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 210 (IB rib 7 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_039_ib_rib_8_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "IB rib 8 (IB-RIB-8) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "IB-RIB-8",
    "coordinates": {
      "latitude": 11.4931,
      "longitude": 77.2794
    },
    "keywords": [
      "ib rib 8",
      "ib-rib-8",
      "bit",
      "gurugualam",
      "ib",
      "rib",
      "ground",
      "floor",
      "electronics",
      "lab",
      "machines",
      "faculty",
      "hall",
      "first",
      "power",
      "and",
      "drives",
      "second"
    ],
    "text": "IB rib 8 (Building Code: IB-RIB-8) houses 5 academic venues, classrooms, and laboratories:\n\n• Ground Floor: BIT - Gurugualam (IB rib 8 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Electronics Lab (IB rib 8 - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Electronics Machines Lab (IB rib 8 - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Faculty Hall (IB rib 8 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Power Electronics and Drives Lab (IB rib 8 - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_040_ib_rib_9_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "IB rib 9 (IB-RIB-9) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "IB-RIB-9",
    "coordinates": {
      "latitude": 11.493,
      "longitude": 77.2795
    },
    "keywords": [
      "ib rib 9",
      "ib-rib-9",
      "xerox",
      "printout",
      "ib",
      "rib",
      "ground",
      "floor",
      "seminar",
      "hall",
      "mech",
      "ww",
      "101",
      "first",
      "ww101",
      "ww 101",
      "102",
      "ww102",
      "ww 102",
      "103",
      "ww103",
      "ww 103",
      "201",
      "second",
      "ww201",
      "ww 201",
      "202",
      "ww202",
      "ww 202"
    ],
    "text": "IB rib 9 (Building Code: IB-RIB-9) houses 7 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Xerox printout (IB rib 9 - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Seminar Hall Mech (IB rib 9 - Ground Floor) - [Category: Seminar Hall, Capacity: 75 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: WW 101 (IB rib 9 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: WW 102 (IB rib 9 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: WW 103 (IB rib 9 - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 201 (IB rib 9 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: WW 202 (IB rib 9 - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_041_internet_centre_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "Internet Centre (INTERNET-CENTRE) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "INTERNET-CENTRE",
    "coordinates": {
      "latitude": 11.4926,
      "longitude": 77.2799
    },
    "keywords": [
      "internet centre",
      "internet-centre",
      "internet",
      "centre",
      "ground",
      "floor",
      "controller",
      "of",
      "examination",
      "coe",
      "first"
    ],
    "text": "Internet Centre (Building Code: INTERNET-CENTRE) houses 2 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Internet Centre (Internet Centre - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Controller of Examination (COE) (Internet Centre - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_042_mechanic_front_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "Mech Block Entrance (MECHANIC-FRONT) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "MECHANIC-FRONT",
    "coordinates": {
      "latitude": 11.4958,
      "longitude": 77.2767
    },
    "keywords": [
      "mech block entrance",
      "mechanic-front",
      "department",
      "of",
      "mechanical",
      "engineering",
      "mech",
      "block",
      "entrance",
      "ground",
      "floor",
      "office",
      "library",
      "smart",
      "class",
      "room",
      "reprography",
      "center",
      "cyber",
      "security",
      "lab",
      "mechanics",
      "first",
      "mathematics",
      "experience",
      "centre",
      "me",
      "101",
      "me101",
      "me 101",
      "102",
      "me102",
      "me 102",
      "103",
      "me103",
      "me 103",
      "104",
      "me104",
      "me 104",
      "105",
      "me105",
      "me 105",
      "106",
      "me106",
      "me 106"
    ],
    "text": "Mech Block Entrance (Building Code: MECHANIC-FRONT) houses 31 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Department of Mechanical Engineering (Mech Block Entrance - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Department office (Mech) (Mech Block Entrance - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Department Library (Mech) (Mech Block Entrance - Ground Floor) - [Category: Library Rooms, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Smart class room (Mech Block Entrance - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Reprography Center (Mech Block Entrance - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Cyber Security Lab (Mech Block Entrance - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Department of Mechanics (Mech Block Entrance - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Mathematics Experience Centre (ME 101) (Mech Block Entrance - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: ME 102 (Mech Block Entrance - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: ME 103 (Mech Block Entrance - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: ME 104 (Mech Block Entrance - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: ME 105 (Mech Block Entrance - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: ME 106 (Mech Block Entrance - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: ME 107 (Mech Block Entrance - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: ME 108 (Mech Block Entrance - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Department of Aeronautical (Mech Block Entrance - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: ME 201 (Mech Block Entrance - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: ME 202 (Mech Block Entrance - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: ME 203 (Mech Block Entrance - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: ME 204 (Mech Block Entrance - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: ME 205 (Mech Block Entrance - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: ME 206 (Mech Block Entrance - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Faculty Hall 1 (Mech Block Entrance - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 3rd Floor: Department of Agriculture (Mech Block Entrance - Third Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 3rd Floor: ME 301 (Mech Block Entrance - Third Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 3rd Floor: ME 302 (Mech Block Entrance - Third Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 3rd Floor: ME 303 (Mech Block Entrance - Third Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 3rd Floor: ME 304 (Mech Block Entrance - Third Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 3rd Floor: ME 305 (Mech Block Entrance - Third Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 3rd Floor: ME 306 (Mech Block Entrance - Third Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 3rd Floor: Faculty Hall  2 (Mech Block Entrance - Third Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_043_mechanic_back_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "Mechanic Block (MECHANIC-BACK) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "MECHANIC-BACK",
    "coordinates": {
      "latitude": 11.4957,
      "longitude": 77.2768
    },
    "keywords": [
      "mechanic block",
      "mechanic-back",
      "basic",
      "workshop",
      "mechanic",
      "block",
      "base",
      "floor",
      "inventory",
      "area",
      "special",
      "machinery",
      "shop",
      "ground",
      "strength",
      "of",
      "materials",
      "lab",
      "lathe",
      "meteorology",
      "aqua",
      "sub",
      "bit",
      "research",
      "center",
      "fluid",
      "mechanics",
      "thermal",
      "engineering",
      "non",
      "destructive",
      "testing",
      "sensor",
      "and",
      "instrumentation",
      "first",
      "mems",
      "laboratory",
      "mechatronics",
      "harita",
      "sew",
      "eurodrive",
      "kinematics",
      "dynamic",
      "metallurgy"
    ],
    "text": "Mechanic Block (Building Code: MECHANIC-BACK) houses 34 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Basic Workshop (Mechanic Block - Base Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Inventory Area (Mechanic Block - Base Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Special Machinery Shop (Mechanic Block - Ground floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Strength of Materials Lab (Mechanic Block - Ground floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Lathe Shop (Mechanic Block - Ground floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Meteorology Lab (Mechanic Block - Ground floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Aqua Sub BIT research center (Mechanic Block - Ground floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Fluid Mechanics (Mechanic Block - Ground floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Thermal Engineering lab (Mechanic Block - Ground floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Non-Destructive Testing Lab (Mechanic Block - Ground floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Sensor and Instrumentation lab (Mechanic Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: MEMS Laboratory (Mechanic Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Mechatronics Lab (Mechanic Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: BIT - Harita Lab (Mechanic Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Sew Eurodrive Lab (Mechanic Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Kinematics & Dynamic Lab (Mechanic Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Metallurgy Lab (Mechanic Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Aircraft Structure Lab (Mechanic Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Avionics Lab (Mechanic Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Basic Workshop (Mechanic Block - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Industrial and Mobile Robotics Lab (Mechanic Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: CAM Lab (Mechanic Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: FANUC centre for FOR CNC Machine (Mechanic Block - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: BIT - FESTO Centre (Mechanic Block - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: CAD Lab (Mechanic Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Heat Transfer Lab (Mechanic Block - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Industrial Safety Lab (Mechanic Block - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Energy Management Lab (Mechanic Block - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Automative Components Lab (Mechanic Block - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Smart Agriculture Lab (Mechanic Block - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Drawing Hall 1 (Mechanic Block - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Drawing Hall 2 (Mechanic Block - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Fundamentals of Mechanical Engg Lab (Mechanic Block - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Statics Laboratory (Mechanic Block - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_044_girls_mess_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "Mess (GIRLS-MESS) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "GIRLS-MESS",
    "coordinates": {
      "latitude": 11.4921,
      "longitude": 77.2804
    },
    "keywords": [
      "mess",
      "girls-mess",
      "ground",
      "floor",
      "dance",
      "hall",
      "first",
      "girls",
      "gym"
    ],
    "text": "Mess (Building Code: GIRLS-MESS) houses 4 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Mess (Mess - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Dance Hall (Mess - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Girls Gym (Mess - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Mess (Mess - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_045_placement_and_training_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "Placement and Training Cell (PLACEMENT-AND-TRAINING) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "PLACEMENT-AND-TRAINING",
    "coordinates": {
      "latitude": 11.4925,
      "longitude": 77.28
    },
    "keywords": [
      "placement and training cell",
      "placement-and-training",
      "department",
      "of",
      "training",
      "and",
      "placement",
      "cell",
      "ground",
      "floor",
      "vedhanayagam",
      "auditorium",
      "first"
    ],
    "text": "Placement and Training Cell (Building Code: PLACEMENT-AND-TRAINING) houses 2 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Department of Training and Placement (Placement and Training Cell - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Vedhanayagam Auditorium (Placement and Training Cell - First Floor) - [Category: Auditorium, Capacity: 1500 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_046_recreation_hall_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "Recreation Hall (RECREATION-HALL) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "RECREATION-HALL",
    "coordinates": {
      "latitude": 11.4922,
      "longitude": 77.2803
    },
    "keywords": [
      "recreation hall",
      "recreation-hall",
      "conventional",
      "store",
      "recreation",
      "hall",
      "ground",
      "floor",
      "gift",
      "shop",
      "mobile",
      "first"
    ],
    "text": "Recreation Hall (Building Code: RECREATION-HALL) houses 4 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Conventional Store (Recreation Hall - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Gift Shop (Recreation Hall - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Mobile Shop (Recreation Hall - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Recreation Hall (Recreation Hall - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_047_sf_block_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "SF Block (SF-BLOCK) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "SF-BLOCK",
    "coordinates": {
      "latitude": 11.496,
      "longitude": 77.2765
    },
    "keywords": [
      "sf block",
      "sf-block",
      "it",
      "001",
      "sf",
      "block",
      "base",
      "floor",
      "it001",
      "it 001",
      "002",
      "it002",
      "it 002",
      "003",
      "it003",
      "it 003",
      "seminar",
      "hall",
      "101",
      "ground",
      "it101",
      "it 101",
      "102",
      "it102",
      "it 102",
      "department",
      "of",
      "information",
      "technology",
      "artificial",
      "intelligence",
      "lab",
      "ai",
      "cs",
      "201",
      "first",
      "cs201",
      "cs 201",
      "202",
      "cs202",
      "cs 202",
      "203",
      "cs203",
      "cs 203",
      "computer"
    ],
    "text": "SF Block (Building Code: SF-BLOCK) houses 17 academic venues, classrooms, and laboratories:\n\n• Ground Floor: IT 001 (SF Block - Base Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: IT 002 (SF Block - Base Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: IT 003 (SF Block - Base Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: IT Seminar Hall (SF Block - Base Floor) - [Category: Seminar Hall, Capacity: 75 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: IT 101 (SF Block - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: IT 102 (SF Block - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Department of Information Technology (SF Block - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Artificial Intelligence Lab (AI Lab) (SF Block - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: CS 201 (SF Block - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: CS 202 💞 (SF Block - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: CS 203 (SF Block - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Department of Computer Science and Engineering (SF Block - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: CSE Lab 1 (SF Block - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: AIML 101 (SF Block - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 3rd Floor: CS 302 (SF Block - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 3rd Floor: CS 303 (SF Block - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Auditorium (SF Block - Second Floor) - [Category: Auditorium, Capacity: 1500 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_048_sf_block_labs_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "SF Block Labs (SF-BLOCK-LABS) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "SF-BLOCK-LABS",
    "coordinates": {
      "latitude": 11.4959,
      "longitude": 77.2766
    },
    "keywords": [
      "sf block labs",
      "sf-block-labs",
      "civil",
      "practical",
      "labs",
      "sf",
      "block",
      "base",
      "floor",
      "data",
      "mining",
      "lab",
      "ground",
      "cloud",
      "computing",
      "dbms",
      "faculty",
      "hall",
      "programming",
      "sunflower",
      "cse",
      "first",
      "networking",
      "web",
      "technology",
      "open",
      "source",
      "department",
      "of",
      "artificial",
      "intelligence",
      "and",
      "machine",
      "learning",
      "second",
      "structure",
      "10",
      "hall10",
      "hall 10"
    ],
    "text": "SF Block Labs (Building Code: SF-BLOCK-LABS) houses 19 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Civil Practical Labs (SF Block Labs - Base Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Data Mining Lab (SF Block Labs - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Cloud Computing Lab (SF Block Labs - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: DBMS Lab (SF Block Labs - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Faculty Hall 5 (SF Block Labs - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Faculty Hall 7 (SF Block Labs - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Programming Lab (SF Block Labs - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: sunflower block (SF Block Labs - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: CSE Lab 2 (SF Block Labs - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: CSE Lab 3 (Networking Lab) (SF Block Labs - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Faculty Hall 5 (SF Block Labs - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: CSE Lab 4 (Web Technology Lab) (SF Block Labs - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: CSE Lab 5 (Open Source Lab) (SF Block Labs - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Department of Artificial Intelligence and Machine Learning (SF Block Labs - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: CSE Lab 6 (SF Block Labs - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: CSE Lab 7 (Data Structure Lab 7) (SF Block Labs - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: CSE Lab 8 (SF Block Labs - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: CSE Lab 9 (SF Block Labs - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Faculty Hall 10 (SF Block Labs - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_049_as_main_right_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "Special Labs (AS-MAIN-RIGHT) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "AS-MAIN-RIGHT",
    "coordinates": {
      "latitude": 11.4955,
      "longitude": 77.277
    },
    "keywords": [
      "special labs",
      "as-main-right",
      "manufacturing",
      "and",
      "fabrication",
      "lab",
      "special",
      "labs",
      "base",
      "floor",
      "hybrid",
      "human",
      "powered",
      "vehicle",
      "agricultural",
      "on",
      "road",
      "off",
      "mf",
      "sustainable",
      "civil",
      "engineering",
      "materials",
      "kart",
      "electrical",
      "reprographic",
      "centre",
      "ground",
      "cb",
      "101",
      "cb101",
      "cb 101",
      "electronic",
      "system",
      "for",
      "wildlife",
      "conservation",
      "virtual",
      "instrumentation",
      "block",
      "chain",
      "technology",
      "product",
      "innovation",
      "intelligence"
    ],
    "text": "Special Labs (Building Code: AS-MAIN-RIGHT) houses 39 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Manufacturing and Fabrication Lab (Special Labs - Base Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Hybrid Human Powered Vehicle (Special Labs - Base Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Agricultural Vehicle (Special Labs - Base Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: On Road Off Road Vehicle (Special Labs - Base Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: MF Lab (Special Labs - Base Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Sustainable Civil Engineering Materials Lab (Special Labs - Base Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Kart Vehicle (Special Labs - Base Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Electrical Vehicle (Special Labs - Base Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Reprographic Centre (Special Labs - Ground floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: CB 101 (Special Labs - Ground floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Electronic System for Wildlife Conservation Lab (Special Labs - Ground floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Virtual Instrumentation Lab (Special Labs - Ground floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Block Chain Technology Lab (Special Labs - Ground floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Product Innovation Lab (Special Labs - Ground floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Intelligence Innovation Lab (Special Labs - Ground floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Natural Language Processing (NLP) Lab (Special Labs - Ground floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Power Conversion and System Integration Lab (Special Labs - Ground floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: Signal Processing for Health Care Lab (Special Labs - Ground floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• Ground Floor: World Skill Training Centre (Special Labs - Ground floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Department of Computer Science and Business System (Special Labs - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: CSBS Lab 1 (Special Labs - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: CSBS Lab 2 (Special Labs - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: CSBS Lab 3 (Special Labs - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Mathematics Experience Centre (Special Labs - First Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Embedded Technology Lab (Special Labs - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Energy and Thermal Product Development Lab (Special Labs - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Internet of Things (IoT) Lab (Special Labs - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Cloud Computing Lab (Special Labs - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Data Science Lab (Special Labs - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Electrical Product Development Lab (Special Labs - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Next Generation Networking Lab (Special Labs - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Communication & Protocol Lab (Special Labs - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Energy Storage & Conversion Lab (Special Labs - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Micro Prototyping Lab (Special Labs - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Robotics Division (Special Labs - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Drone division (Special Labs - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: 3D printing Division (Special Labs - Second Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: AI Lab (Special Labs - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 2nd Floor: Mobile and Web App Dev Lab (Special Labs - Second Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_050_spinning_lab_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "Spinning Lab (SPINNING-LAB) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "SPINNING-LAB",
    "coordinates": {
      "latitude": 11.4941,
      "longitude": 77.2784
    },
    "keywords": [
      "spinning lab",
      "spinning-lab",
      "spinning",
      "lab",
      "ground",
      "floor",
      "first"
    ],
    "text": "Spinning Lab (Building Code: SPINNING-LAB) houses 2 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Spinning Lab (Spinning Lab - Ground Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)\n• 1st Floor: Spinning Lab (Spinning Lab - First Floor) - [Category: Labs, Capacity: 45 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  },
  {
    "id": "chunk_051_boys_visitor_hall_rooms",
    "sourceFile": "03_rooms_and_labs_directory.md",
    "category": "Rooms & Academic Labs",
    "title": "Visitor hall (Boys) (BOYS-VISITOR-HALL) - Classrooms, Labs & Facilities Directory",
    "buildingCode": "BOYS-VISITOR-HALL",
    "coordinates": {
      "latitude": 11.4923,
      "longitude": 77.2802
    },
    "keywords": [
      "visitor hall (boys)",
      "boys-visitor-hall",
      "boys",
      "visitor",
      "hall",
      "ground",
      "floor"
    ],
    "text": "Visitor hall (Boys) (Building Code: BOYS-VISITOR-HALL) houses 1 academic venues, classrooms, and laboratories:\n\n• Ground Floor: Boys Visitor Hall (Visitor hall (Boys) - Ground Floor) - [Category: Classroom, Capacity: 60 seats] (Facilities: Smart Board, Air Conditioning, Dual Projectors, WiFi 6)"
  }
];

const CAMPUS_KEEP_TOKENS = new Set([
  'it', 'cs', 'ib', 'as', 'ai', 'me', 'ee', 'ec', 'sf', 'ww', 'am', 'bt', 'ft', 'mc',
  '001', '002', '003', '004', '005', '006', '007', '008', '010', '011', '012',
  '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '117', '118',
  '201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216', '217', '218', '219', '220', '221', '222', '223', '224', '225', '226', '227',
  '301', '302', '303'
]);

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'cannot',
  'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further',
  'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'him', 'his', 'how', 'i', 'if', 'in',
  'into', 'is', 'it', 'its', 'let', 'me', 'more', 'most', 'my', 'no', 'nor', 'not', 'of', 'off', 'on',
  'once', 'only', 'or', 'other', 'ought', 'our', 'out', 'over', 'own', 'same', 'she', 'should', 'so',
  'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'then', 'there', 'these', 'they',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what',
  'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'locate', 'find', 'show', 'tell'
]);

function normalizeQuery(text) {
  if (!text) return '';
  return text
    .replace(/([a-zA-Z]+)(\d+)/g, '$1 $2')
    .replace(/(\d+)([a-zA-Z]+)/g, '$1 $2');
}

function matchRoomInLine(query, line) {
  if (!line || (!line.startsWith('• Floor') && !line.startsWith('| **'))) return false;
  const lineClean = line.toLowerCase();
  const lineUnspaced = lineClean.replace(/[^a-z0-9]/g, '');

  // 1. Alphanumeric room patterns like WW102, IT001, CS201, EW113, ME105, AIML101, CB101
  const alphaNumMatches = query.match(/([a-zA-Z]{1,4})\s*([0-9]{2,4})/gi);
  if (alphaNumMatches) {
    for (const match of alphaNumMatches) {
      const roomTarget = match.replace(/[^a-z0-9]/gi, '').toLowerCase();
      if (roomTarget.length >= 3 && lineUnspaced.includes(roomTarget)) {
        return true;
      }
    }
  }

  // 2. Exact words matching for lab/venue names
  const qTokens = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
  if (qTokens.length > 0) {
    const matchCount = qTokens.filter(token => lineClean.includes(token)).length;
    if (matchCount === qTokens.length && qTokens.length >= 2) return true;
    if (matchCount >= 2 && qTokens.length >= 2 && matchCount / qTokens.length >= 0.6) return true;
  }

  return false;
}

export const clientRagEngine = {
  query: (userQuery) => {
    const rawQ = userQuery || '';
    const normQ = normalizeQuery(rawQ);
    const q = `${rawQ} ${normQ}`.toLowerCase();
    const qUnspaced = rawQ.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Scored matching
    const scored = CAMPUS_CHUNKS.map(chunk => {
      let score = 0;
      const text = chunk.text.toLowerCase();
      const title = chunk.title.toLowerCase();
      const textUnspaced = text.replace(/[^a-z0-9]/g, '');
      const keywords = (chunk.keywords || []).join(' ').toLowerCase();

      // Direct room line match boost
      const lines = (chunk.text || '').split('\n');
      for (const line of lines) {
        if (matchRoomInLine(rawQ, line)) {
          score += 80;
          break;
        }
      }

      if (text.includes(q) || text.includes(normQ.toLowerCase())) score += 20;
      if (qUnspaced.length >= 4 && textUnspaced.includes(qUnspaced)) score += 35;
      if (title.includes(q) || title.includes(normQ.toLowerCase())) score += 25;
      
      const words = q.split(/\s+/).filter(w => w.length > 1 || CAMPUS_KEEP_TOKENS.has(w));
      words.forEach(w => {
        if (title.includes(w)) score += 4;
        if (keywords.includes(w)) score += 4;
        if (text.includes(w)) score += 1.5;
      });

      if (chunk.buildingCode && (q.includes(chunk.buildingCode.toLowerCase()) || normQ.toLowerCase().includes(chunk.buildingCode.toLowerCase()))) {
        score += 35;
      }

      return { chunk, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const topChunks = scored.slice(0, 3).map(s => s.chunk);

    let targetLocation = null;

    // Check retrieved chunks for matching room lines to get accurate destination
    for (const chunk of topChunks) {
      if (chunk.buildingCode && chunk.text) {
        const lines = chunk.text.split('\n');
        for (const line of lines) {
          if (matchRoomInLine(rawQ, line)) {
            const cleanName = chunk.title.split('(')[0].trim();
            targetLocation = {
              name: cleanName || chunk.title.split('-')[0].trim(),
              destination: chunk.buildingCode.toLowerCase().replace(/_/g, '-')
            };
            break;
          }
        }
      }
      if (targetLocation) break;
    }

    const ribMatch = q.match(/(as|ib)\s*rib\s*(\d+)/i);
    if (!targetLocation && ribMatch) {
      const type = ribMatch[1].toUpperCase();
      const num = ribMatch[2];
      targetLocation = { name: `${type} rib ${num}`, destination: `${type.toLowerCase()}-rib-${num}` };
    }

    // Detect if a specific location is referenced
    const locationRules = [
      { keys: ['ai lab', 'artificial intelligence lab', 'sf block labs', 'data science lab'], name: 'SF Block Labs', code: 'sf-block-labs' },
      { keys: ['sf block', 'sf academic', 'it 001', 'it 002', 'it 003', 'it 101', 'it 102', 'cs 201', 'cs 202', 'cs 203', 'aiml 101'], name: 'SF Block', code: 'sf-block' },
      { keys: ['library', 'learning center', 'lrn-ctr', 'central library', 'study pod'], name: 'BIT Central Learning Center', code: 'library' },
      { keys: ['medical center', 'hospital', 'clinic', 'ambulance', 'doctor', 'med-ctr'], name: 'BIT Medical Center', code: 'medical-centre' },
      { keys: ['canteen', 'cafeteria', 'food court', 'dining', 'bit-caf'], name: 'Central Cafeteria', code: 'canteen' },
      { keys: ['mess', 'girls mess'], name: 'Campus Dining Mess', code: 'girls-mess' },
      { keys: ['ib block', 'institution building', 'ece', 'eee', 'vlsi'], name: 'IB Academic Block', code: 'ib-block-1' },
      { keys: ['mech block entrance', 'mechanic front'], name: 'Mech Block Entrance', code: 'mechanic-front' },
      { keys: ['mechanic block', 'mech block', 'cnc', 'maker studio', 'robotics'], name: 'Mechanic Block', code: 'mechanic-back' },
      { keys: ['special labs', 'human powered vehicle', 'manufacturing and fab'], name: 'Special Labs', code: 'as-main-right' },
      { keys: ['as block', 'applied science', 'physics lab', 'chemistry lab', 'maths'], name: 'AS Block', code: 'as-main-left' },
      { keys: ['fashion resource', 'fashion centre'], name: 'Fashion Resource Centre', code: 'fashion-centre' },
      { keys: ['spinning lab'], name: 'Spinning Lab', code: 'spinning-lab' },
      { keys: ['auditorium', 'vedhanayagam', 'convention hall', 'seminar hall'], name: 'Vedhanayagam Auditorium', code: 'auditorium' },
      { keys: ['boys hostel', 'hostel boys'], name: 'Boys Hostel Complex', code: 'boys-hostel' },
      { keys: ['girls hostel', 'hostel girls'], name: 'Girls Hostel Complex', code: 'girls-hostel' },
      { keys: ['hostel'], name: 'Campus Hostels', code: 'boys-hostel' },
      { keys: ['gym', 'indoor gym'], name: 'Campus Indoor Gym', code: 'indoor-gym' },
      { keys: ['sports complex', 'cricket ground', 'athletic track', 'tennis', 'badminton', 'basketball'], name: 'Campus Sports Arena & Grounds', code: 'sports-complex' },
      { keys: ['guest house'], name: 'BIT Guest House', code: 'guest-house' },
      { keys: ['main gate', 'gate a'], name: 'Main Gate A', code: 'main-gate' },
      { keys: ['gate c'], name: 'Gate C (West Entrance)', code: 'gate-c' },
      { keys: ['parking', 'ev charging'], name: 'Central Parking & EV Bays', code: 'parking' }
    ];

    if (!targetLocation) {
      for (const rule of locationRules) {
        if (rule.keys.some(k => q.includes(k))) {
          targetLocation = { name: rule.name, destination: rule.code };
          break;
        }
      }
    }

    if (!targetLocation) {
      const bChunk = topChunks.find(c => c.buildingCode);
      if (bChunk) {
        const cleanName = bChunk.title.split('(')[0].trim();
        targetLocation = {
          name: cleanName || bChunk.title.split('-')[0].trim(),
          destination: bChunk.buildingCode.toLowerCase().replace(/_/g, '-')
        };
      }
    }

    let answer = '';
    let suggestedActions = [];
    let suggestedFollowUps = [];

    // Check for specific room line in retrieved chunks
    let specificRoomLine = null;
    let matchedChunk = topChunks[0] || CAMPUS_CHUNKS[0];

    for (const chunk of topChunks) {
      const allLines = (chunk.text || '').split('\n');
      for (const line of allLines) {
        if (matchRoomInLine(rawQ, line)) {
          specificRoomLine = line;
          matchedChunk = chunk;
          break;
        }
      }
      if (specificRoomLine) break;
    }

    // Synthesize based on query intent
    if (q.includes('ai lab') || q.includes('artificial intelligence')) {
      answer = `📍 **Artificial Intelligence Lab (AI Lab)** is located on the **Ground Floor (Floor 1)** of the **SF Academic Block (\`SF-BLK\`)**.\n\n` +
        `• **Directions:** Enter the SF Block main lobby, walk down the central hallway, and the AI Lab is on your left, adjacent to Room IT 102.\n` +
        `• **Equipment:** Equipped with high-performance GPU workstations and deep learning clusters.\n` +
        `• **Access & Booking:** Open 08:30 AM - 08:00 PM for approved research and academic projects via the app's Booking tab.`;
      
      suggestedActions = [
        { type: 'navigate', label: '🚀 Explore Route to AI Lab', destination: 'sf-block-labs', placeName: 'Artificial Intelligence Lab', isExplorePrompt: true },
        { type: 'book', label: 'Book AI Lab Slot', targetTab: 'Bookings' }
      ];
      suggestedFollowUps = [
        'How do I book the AI Lab with GPU clusters?',
        'Where is the nearest parking to SF Block?',
        'What are the opening hours of SF Block labs?'
      ];
    } else if (q.includes('curfew') || (q.includes('hostel') && (q.includes('time') || q.includes('close')))) {
      answer = `⏰ **Campus Hostel Curfew Timings:**\n\n` +
        `• **Boys Hostel (\`BOYS-HST\`):** Curfew is **09:30 PM**.\n` +
        `• **Girls Hostel (\`GIRLS-HST\`):** Curfew is **09:00 PM**.\n\n` +
        `Turnstiles log entry biometrically. Late entry requires prior formal warden approval. The Central Cafeteria is open until 09:30 PM for dinners and refreshments.`;

      suggestedActions = [
        { type: 'navigate', label: '🚀 Explore Route to Hostels', destination: 'boys-hostel', placeName: 'Campus Hostels', isExplorePrompt: true }
      ];
      suggestedFollowUps = [
        'What are the cafeteria timings?',
        'Can parents stay on campus at the Guest House?',
        'What sports facilities are open late?'
      ];
    } else if (q.includes('grace period') || (q.includes('booking') && (q.includes('late') || q.includes('rule')))) {
      answer = `📋 **Booking Check-in & Cancellation Rules:**\n\n` +
        `• **15-Minute Grace Period:** You must scan your digital QR access pass at the room door reader within 15 minutes of your booking start time.\n` +
        `• **Automatic No-Show:** Unclaimed reservations are automatically cancelled after 15 minutes and freed up for others.\n` +
        `• **Cancellation:** Cancellations are free up to 30 minutes before the scheduled slot.\n` +
        `• **Quotas:** Students may maintain up to 2 simultaneous bookings, while faculty may have up to 5.`;

      suggestedActions = [
        { type: 'book', label: 'Go to Facility Bookings', targetTab: 'Bookings' }
      ];
      suggestedFollowUps = [
        'How many active bookings can a student have?',
        'How does the QR access pass work?'
      ];
    } else if (q.includes('emergency') || q.includes('sos') || q.includes('doctor') || q.includes('ambulance')) {
      answer = `🚨 **24/7 Campus Emergency Assistance:**\n\n` +
        `• **Security Emergency SOS:** Internal **Ext 6000** or **6111** (Direct: +91 (04295) 226000)\n` +
        `• **Medical Center (\`MED-CTR\`):** Internal **Ext 6222** (West Campus near Gate C)\n` +
        `• **24/7 ICU Ambulance Dispatch:** Internal **Ext 6223**\n` +
        `• **Anti-Ragging Helpline:** Internal **Ext 6555**\n\n` +
        `The app includes an Emergency SOS button that broadcasts your live coordinates directly to campus security.`;

      suggestedActions = [
        { type: 'navigate', label: '🚀 Explore Route to Medical Center', destination: 'medical-centre', placeName: 'BIT Medical Center', isExplorePrompt: true },
        { type: 'emergency', label: 'Call Emergency Desk (Ext 6000)', phone: '6000' }
      ];
      suggestedFollowUps = [
        'What is the ambulance dispatch number?',
        'Where is the Medical Center located on the map?'
      ];
    } else if (q.includes('dijkstra') || q.includes('road') || q.includes('junction') || q.includes('navigation')) {
      answer = `🗺️ **Campus Dijkstra Navigation System:**\n\n` +
        `• **320 Calibrated Road Junctions:** The routing engine computes shortest paths across verified campus pathways and pedestrian avenues.\n` +
        `• **Wall & Lawn Avoidance:** Routes strictly adhere to paved roads and designated sidewalks—no cutting through walls.\n` +
        `• **Dual Modes:**\n` +
        `  - **Walk Mode (4.5 km/h):** Uses walkways and accommodates wheelchair ramp routes.\n` +
        `  - **Drive Mode (20 km/h):** Strictly routes vehicles onto vehicular asphalt ring roads with parking bay guidance.`;

      suggestedActions = [
        { type: 'navigate', label: 'Open Campus Road Map', destination: 'Map' }
      ];
      suggestedFollowUps = [
        'Are there wheelchair-accessible routes on campus?',
        'How many road network junctions are calibrated?'
      ];
    } else if (q.includes('macbook') || q.includes('vr') || q.includes('quest') || q.includes('drone') || q.includes('asset')) {
      answer = `💻 **Reserveable High-Value Tech Assets:**\n\n` +
        `• **Apple MacBook Pro M3 Max:** Computer Center B-204 (for ML and mobile development).\n` +
        `• **Meta Quest 3 VR Headsets:** Innovation Lab A-102 (spatial computing & simulations).\n` +
        `• **DJI Mavic 3 Pro Drone:** GIS Spatial Analytics Center (requires 24h advance request & certification).\n` +
        `• **Ender 3 Pro 3D Printers:** Maker Studio B-105 (Mechanical Block, 2h to 12h slots).\n\n` +
        `Reserve via the **Assets** tab to generate a cryptographically signed QR checkout voucher.`;

      suggestedActions = [
        { type: 'book', label: 'View Asset Catalog', targetTab: 'Assets' }
      ];
      suggestedFollowUps = [
        'How do I book the Apple MacBook Pro M3?',
        'What are the 3D printer reservation rules?'
      ];
    } else if (specificRoomLine) {
      const cleanMatchedTitle = matchedChunk.title.split('(')[0].trim();
      answer = `📍 **Venue Location Details:**\n\n` +
        `${specificRoomLine}\n\n` +
        `• **Building Complex:** **${cleanMatchedTitle}** (\`${matchedChunk.buildingCode || 'CAMPUS'}\`)\n` +
        (matchedChunk.coordinates ? `• **Coordinates:** \`${matchedChunk.coordinates.latitude}, ${matchedChunk.coordinates.longitude}\`\n` : '') +
        `• **Availability & Booking:** Available for academic sessions and app-based student/faculty reservations.`;
    } else {
      const best = topChunks[0];
      answer = `Based on **${best.title}** (${best.category}):\n\n${best.text}`;
      if (targetLocation) {
        suggestedActions.push({
          type: 'navigate',
          label: `🚀 Explore Route to ${targetLocation.name}`,
          destination: targetLocation.destination,
          placeName: targetLocation.name,
          isExplorePrompt: true
        });
      }
      suggestedFollowUps = [
        'Where is the AI Lab located?',
        'What are the hostel curfew hours?',
        'What is the campus emergency number?'
      ];
    }

    if (targetLocation && !answer.includes('explore how to reach there')) {
      answer += `\n\n📍 **I have preset ${targetLocation.name} as your navigation destination. Would you like to explore how to reach there?**`;
      if (!suggestedActions.some(a => a.type === 'navigate')) {
        suggestedActions.unshift({
          type: 'navigate',
          label: `🚀 Explore Route to ${targetLocation.name}`,
          destination: targetLocation.destination,
          placeName: targetLocation.name,
          isExplorePrompt: true
        });
      }
    }

    return {
      query: userQuery,
      answer,
      targetLocation,
      sources: topChunks.map(c => ({
        id: c.id,
        title: c.title,
        category: c.category,
        sourceFile: c.sourceFile,
        snippet: c.text.slice(0, 160) + '...'
      })),
      suggestedActions,
      suggestedFollowUps
    };
  }
};
