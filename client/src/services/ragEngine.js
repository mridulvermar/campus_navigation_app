/**
 * Client-side Standalone RAG Engine & Offline Fallback
 * Grounded in campus_knowledge_base (10_rag_chunks_metadata.json + FAQs)
 */

export const CAMPUS_CHUNKS = [
  {
    id: "chunk_001_campus_overview",
    sourceFile: "01_campus_overview.md",
    category: "General Information",
    title: "Campus Overview, Geography & Gate Access",
    keywords: ["location", "gates", "gate a", "gate c", "parking", "hours", "sathyamangalam", "coordinates"],
    coordinates: { latitude: 11.4965, longitude: 77.2765 },
    text: "Bannari Amman Institute of Technology (BIT) is a premier 180-acre smart autonomous engineering campus situated in Sathyamangalam, Tamil Nadu. Main Gate A (BIT-GATE-A: 11.500344, 77.277934) serves as the primary 24/7 entrance with vehicle checkposts. Gate C (BIT-GATE-C: 11.493922, 77.273686) is the western entrance for sports arenas and west hostels (06:00 AM - 10:00 PM). Central parking (BIT-PRK: 11.498394, 77.278229) accommodates two-wheelers and four-wheelers with EV charging bays."
  },
  {
    id: "chunk_002_emergency_safety",
    sourceFile: "01_campus_overview.md",
    category: "Emergency & Healthcare",
    title: "Emergency SOS, Medical Center & Safety Hotlines",
    keywords: ["emergency", "sos", "ambulance", "doctor", "medical center", "phone", "extension", "hospital", "helpline", "security"],
    contacts: {
      emergency_desk: "Ext 6000 / 6111",
      medical_center: "Ext 6222",
      ambulance_dispatch: "Ext 6223",
      anti_ragging: "Ext 6555",
      external_phone: "+91 (04295) 226000"
    },
    text: "Emergency assistance is available 24/7 across campus. Call internal extensions 6000/6111 or external line +91 (04295) 226000 for Security SOS. The BIT Medical Center (MED-CTR: 11.493860, 77.274593) provides round-the-clock doctors, 10-bed observation ward, in-house pharmacy, and a 24/7 ICU ambulance (Ext 6222/6223). The mobile app includes a one-touch Emergency SOS button that broadcasts GPS coordinates."
  },
  {
    id: "chunk_003_sf_block_computing",
    sourceFile: "02_buildings_directory.md",
    category: "Academic Buildings",
    title: "SF Academic Block - IT, Computer Science & AI Labs",
    buildingCode: "SF-BLK",
    coordinates: { latitude: 11.496400, longitude: 77.278644 },
    floors: 5,
    keywords: ["sf block", "ai lab", "computer science", "information technology", "data science", "cyber security", "it classrooms"],
    text: "The SF Academic Block (SF-BLK) is a 5-story computing hub. Base Floor contains Smart Classrooms IT 001-003 and the IT Seminar Hall. Floor 1 (Ground Floor) houses IT 101, IT 102, the IT Department Office, the Artificial Intelligence Lab (AI Lab) with GPU clusters, and the Data Science Lab. Floor 2 houses IT 201-205, Full Stack Dev Lab, and Cyber Security Lab. Floor 3 houses IT 301-305, Mobile App & AR/VR Lab, and the SF Conference Room."
  },
  {
    id: "chunk_004_ib_block_core_eng",
    sourceFile: "02_buildings_directory.md",
    category: "Academic Buildings",
    title: "IB Academic Block - Main Wing & East Wing",
    buildingCode: "IB-BLK-MAIN",
    coordinates: { latitude: 11.494307, longitude: 77.276529 },
    floors: 4,
    keywords: ["ib block", "lecture halls", "classes 101-125", "classes 201-225", "electrical", "electronics", "ece", "eee", "vlsi"],
    text: "The Institution Building (IB Block) features two primary wings. The Main Wing (IB-BLK-MAIN) houses Classrooms 101-117 on Floor 1, Classrooms 201-217 on Floor 2, Classrooms 301-317 on Floor 3, Dean Offices, and Power Electronics Labs. The East Wing (IB-BLK-EAST: 11.496902, 77.276419) houses Classrooms 118-125, 218-225, 318-325, VLSI Design Center, Embedded Systems Lab, and DSP Lab."
  },
  {
    id: "chunk_005_specialized_academic_blocks",
    sourceFile: "02_buildings_directory.md",
    category: "Academic Buildings",
    title: "Aeronautical, Mechanical & Applied Science Blocks",
    keywords: ["aeronautical", "mechanical", "as block", "wind tunnel", "robotics", "cnc", "flight simulator", "chemistry", "physics"],
    text: "Aeronautical Block (AERO-BLK: 11.497688, 77.278240, 4 floors) features supersonic wind tunnel labs, flight simulator pods, and avionics studios. Mechanical Block (MECH-BLK: 11.495788, 77.278523, 4 floors) houses CNC workshops, industrial robotics cells, and thermal fluid labs. AS Block (AS-BLK: 11.494401, 77.277540, 4 floors) houses Mathematics, Physics Labs, Chemistry Labs, and Language & Communication Centers."
  },
  {
    id: "chunk_006_library_learning_center",
    sourceFile: "02_buildings_directory.md",
    category: "Library & Auditorium",
    title: "BIT Central Learning Center & Vedhanayagam Auditorium",
    keywords: ["library", "learning center", "books", "study pods", "auditorium", "vedhanayagam", "convocation", "research"],
    text: "BIT Learning Center (LRN-CTR: 11.494200, 77.277162, 4 floors) is open 07:00 AM - 11:00 PM daily with 150,000+ volumes, IEEE digital access, reading halls, private study carrels, and collaboration pods. Vedhanayagam Auditorium (VEDHA-AUD: 11.494976, 77.277006) is a 2,500-seat grand convention hall equipped with line-array acoustics and 4K video projection for convocations and hackathons."
  },
  {
    id: "chunk_007_hostels_and_dining",
    sourceFile: "04_facilities_and_amenities.md",
    category: "Hostels & Dining",
    title: "Boys & Girls Hostels, Guest House & Cafeteria",
    keywords: ["hostel", "boys hostel", "girls hostel", "mess", "cafeteria", "canteen", "food", "guest house", "curfew"],
    text: "Boys Hostel (BOYS-HST: 11.494169, 77.278633, 6 floors, curfew 09:30 PM) and Girls Hostel (GIRLS-HST: 11.493970, 77.275827, 5 floors, curfew 09:00 PM) offer secure accommodation with dining messes, gyms, and WiFi. Central Cafeteria (BIT-CAF: 11.493778, 77.277569, open 07:00 AM - 09:30 PM) provides South/North Indian food courts, bakery, and juice bars. BIT Guest House (GST-HOUSE: 11.499858, 77.278559) offers 32 VIP AC suites for visitors."
  },
  {
    id: "chunk_008_sports_facilities",
    sourceFile: "04_facilities_and_amenities.md",
    category: "Sports & Recreation",
    title: "Sports Complex, Cricket Ground, Track & Courts",
    keywords: ["sports", "cricket ground", "athletic track", "tennis", "handball", "badminton", "basketball", "gym"],
    text: "Campus sports infrastructure includes a 400m synthetic Athletic Track (ATHLETIC-CRT, 05:30 AM - 09:00 PM), standard turf Cricket Ground (CRICKET-GND, 06:00 AM - 07:00 PM), floodlit synthetic Tennis Courts (TENNIS-CRT), Handball Court (HANDBALL-CRT), outdoor Basketball & Volleyball Sports Arena (SPORTS-ARNA, 06:00 AM - 09:30 PM), and an Indoor Badminton Complex with 4 wooden courts (BADMINTON-CRT, 06:00 AM - 09:30 PM)."
  },
  {
    id: "chunk_009_reserveable_tech_assets",
    sourceFile: "05_asset_and_equipment_catalog.md",
    category: "Assets & Equipment",
    title: "High-Value Tech Assets, MacBooks, VR & Drones",
    keywords: ["assets", "macbook", "vr headset", "quest 3", "drone", "dji mavic", "3d printer", "projector", "equipment"],
    text: "Reserveable campus assets include: (1) Apple MacBook Pro M3 Max (SN-MAC-2026-001) in Computer Center B-204 for ML/iOS projects; (2) Meta Quest 3 VR Headset (SN-VRQ3-2026-882) in Innovation Lab A-102 for spatial simulation; (3) DJI Mavic 3 Pro Survey Drone (SN-DJI-DRONE-991) in GIS Center for photogrammetry; (4) Ender 3 Pro 3D Printer (SN-3DP-2026-302) in Maker Studio B-105; and (5) Epson 4K Laser Projector (SN-PRJ-2026-092) in Library Pod 204."
  },
  {
    id: "chunk_010_booking_sops_and_qr_passes",
    sourceFile: "06_booking_and_reservation_rules.md",
    category: "Booking Rules & SOPs",
    title: "Facility Booking, QR Access Passes & Check-in Rules",
    keywords: ["booking rules", "qr code", "digital pass", "check in", "grace period", "cancellation", "permissions", "no show"],
    text: "Facility and asset bookings generate an instant encrypted QR Digital Access Pass. Users must scan their QR code at the room door reader or lab desk within a 15-minute grace period; failing to check in results in auto-cancellation as 'No-Show' to prevent ghost bookings. Cancellations are free up to 30 minutes prior. Students can have up to 2 active bookings, faculty up to 5."
  },
  {
    id: "chunk_011_dijkstra_navigation_engine",
    sourceFile: "07_navigation_and_gis_routing.md",
    category: "Navigation & GIS",
    title: "Dijkstra Road Routing, 320 Junctions & Dual Modes",
    keywords: ["dijkstra", "navigation engine", "routing", "road junctions", "walk mode", "drive mode", "gps", "wheelchair"],
    text: "The campus navigation engine uses Dijkstra's algorithm across 320 calibrated road junctions to generate strict road paths that avoid building collisions. Walk Mode utilizes pedestrian avenues and walkways at 4.5 km/h with wheelchair ramp filtering. Drive Mode routes vehicles strictly on vehicular asphalt ring roads at 20 km/h and directs drivers to the nearest parking bay. Live GPS marker syncs with real-time Socket.IO telemetry."
  },
  {
    id: "chunk_012_events_and_competitions",
    sourceFile: "08_events_and_campus_life.md",
    category: "Events & Highlights",
    title: "Hackathons, Symposia, Sports League & Clubs",
    keywords: ["events", "hackathon", "symposium", "sports league", "gdsc", "robotics club", "bit code"],
    text: "Major recurring campus events include: National Smart Campus Hackathon 2026 (Sep 05-07, Main Auditorium & SF Labs, 350+ attendees), AI & Robotics Symposium (Sep 12, IB Seminar Hall II, 180+ delegates), and BIT Inter-College Sports League (Sep 18-21, Sports Complex, 500+ athletes). Active student clubs include Google Developer Student Club (GDSC), Robotics & Automation Society (RAS), and Coding Guild."
  }
];

export const clientRagEngine = {
  query: (userQuery) => {
    const q = (userQuery || '').toLowerCase();
    
    // Scored matching
    const scored = CAMPUS_CHUNKS.map(chunk => {
      let score = 0;
      const text = chunk.text.toLowerCase();
      const title = chunk.title.toLowerCase();
      const keywords = (chunk.keywords || []).join(' ').toLowerCase();

      if (text.includes(q)) score += 10;
      if (title.includes(q)) score += 12;
      
      const words = q.split(/\s+/).filter(w => w.length > 2);
      words.forEach(w => {
        if (title.includes(w)) score += 4;
        if (keywords.includes(w)) score += 3;
        if (text.includes(w)) score += 1.5;
      });

      return { chunk, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const topChunks = scored.slice(0, 3).map(s => s.chunk);

    // Detect if a specific location is referenced
    const locationRules = [
      { keys: ['ai lab', 'artificial intelligence lab', 'sf block', 'sf academic', 'computer center', 'it lab'], name: 'Artificial Intelligence Lab (SF Block)', code: 'sf-block-labs' },
      { keys: ['library', 'learning center', 'lrn-ctr', 'central library', 'study pod'], name: 'BIT Central Learning Center', code: 'library' },
      { keys: ['medical center', 'hospital', 'clinic', 'ambulance', 'doctor', 'med-ctr'], name: 'BIT Medical Center', code: 'medical-centre' },
      { keys: ['canteen', 'cafeteria', 'food court', 'mess', 'dining', 'bit-caf'], name: 'Central Cafeteria', code: 'canteen' },
      { keys: ['ib block', 'institution building', 'ece', 'eee'], name: 'IB Academic Block', code: 'ib-block' },
      { keys: ['mech block', 'mechanical block', 'cnc', 'maker studio'], name: 'Mechanical Block', code: 'mechanical-block' },
      { keys: ['aero block', 'aeronautical block', 'wind tunnel'], name: 'Aeronautical Block', code: 'aero-block' },
      { keys: ['as block', 'applied science', 'physics lab', 'chemistry lab'], name: 'Applied Science Block', code: 'as-block' },
      { keys: ['auditorium', 'vedhanayagam'], name: 'Vedhanayagam Auditorium', code: 'auditorium' },
      { keys: ['boys hostel', 'hostel boys'], name: 'Boys Hostel Complex', code: 'boys-hostel' },
      { keys: ['girls hostel', 'hostel girls'], name: 'Girls Hostel Complex', code: 'girls-hostel' },
      { keys: ['hostel'], name: 'Campus Hostels', code: 'boys-hostel' },
      { keys: ['sports complex', 'cricket ground', 'athletic track'], name: 'Campus Sports Arena & Grounds', code: 'sports-complex' },
      { keys: ['guest house'], name: 'BIT Guest House', code: 'guest-house' },
      { keys: ['main gate', 'gate a'], name: 'Main Gate A', code: 'main-gate' },
      { keys: ['gate c'], name: 'Gate C (West Entrance)', code: 'gate-c' },
      { keys: ['parking', 'ev charging'], name: 'Central Parking & EV Bays', code: 'parking' }
    ];

    let targetLocation = null;
    for (const rule of locationRules) {
      if (rule.keys.some(k => q.includes(k))) {
        targetLocation = { name: rule.name, destination: rule.code };
        break;
      }
    }
    if (!targetLocation) {
      const bChunk = topChunks.find(c => c.buildingCode);
      if (bChunk) {
        targetLocation = {
          name: bChunk.title.split('-')[0].trim(),
          destination: bChunk.buildingCode.toLowerCase().replace(/_/g, '-')
        };
      }
    }

    let answer = '';
    let suggestedActions = [];
    let suggestedFollowUps = [];

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
