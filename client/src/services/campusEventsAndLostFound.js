import AsyncStorage from '@react-native-async-storage/async-storage';

const EVENTS_STORAGE_KEY = 'campus_custom_events_v1';
const LOST_FOUND_STORAGE_KEY = 'campus_custom_lost_found_v1';

export const INITIAL_CAMPUS_EVENTS = [
  {
    id: 'evt-1',
    title: 'National AI & Spatial Robotics Symposium 2026',
    category: 'KEYNOTE & TECH EXPO',
    status: 'LIVE EVENT',
    statusVariant: 'danger',
    time: 'Today · 10:00 AM – 04:30 PM',
    venue: 'Vedhanayagam Auditorium',
    destCode: 'auditorium',
    createdBy: 'Campus Administration',
    isOfficial: true
  },
  {
    id: 'evt-2',
    title: 'Smart Campus 24-Hour AI Hackathon',
    category: 'INNOVATION HACKATHON',
    status: 'STARTS TOMORROW',
    statusVariant: 'success',
    time: 'Tomorrow · Starts 09:00 AM',
    venue: 'AS Academic Block · Special Labs Floor 2',
    destCode: 'as-block',
    createdBy: 'Campus Administration',
    isOfficial: true
  },
  {
    id: 'evt-3',
    title: 'BIT Inter-Collegiate Athletics Championship',
    category: 'ANNUAL SPORTS MEET',
    status: 'OPEN ENTRY',
    statusVariant: 'success',
    time: 'Saturday · 07:30 AM onwards',
    venue: 'BIT Sports Arena & Athletic Grounds',
    destCode: 'sports-ground',
    createdBy: 'Campus Administration',
    isOfficial: true
  }
];

export const INITIAL_LOST_FOUND = [
  {
    id: 'lf-1',
    title: 'Casio fx-991CW Scientific Calculator',
    type: 'FOUND',
    typeBg: 'rgba(16, 185, 129, 0.12)',
    typeColor: '#059669',
    location: 'Found near AS Block Floor 2 Corridor',
    desk: 'AS Block Department Office',
    destCode: 'as-block',
    time: '2 hours ago',
    claimed: false,
    claimedBy: null,
    addedBy: 'Admin Post 1'
  },
  {
    id: 'lf-2',
    title: 'Student ID Card & RFID Lanyard',
    type: 'DEPOSITED',
    typeBg: 'rgba(59, 130, 246, 0.12)',
    typeColor: '#2563EB',
    location: 'Found near Central Campus Cafeteria',
    desk: 'Main Gate Security Office',
    destCode: 'main-gate',
    time: 'Today · 11:30 AM',
    claimed: false,
    claimedBy: null,
    addedBy: 'Admin Post 1'
  },
  {
    id: 'lf-3',
    title: 'Apple 140W USB-C Power Adapter',
    type: 'REPORTED LOST',
    typeBg: 'rgba(234, 162, 40, 0.15)',
    typeColor: '#B45309',
    location: 'Reported lost at Learning Center Library Floor 1',
    desk: 'Library Help Desk',
    destCode: 'library',
    time: 'Yesterday · 04:15 PM',
    claimed: false,
    claimedBy: null,
    addedBy: 'Admin Post 1'
  }
];

export const checkIsAdmin = (user) => {
  if (!user) return false;
  return user.role === 'admin' || (typeof user.email === 'string' && user.email.toLowerCase().includes('admin'));
};

export const campusEventsService = {
  // --- EVENTS API ---
  getEvents: async () => {
    try {
      const stored = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(INITIAL_CAMPUS_EVENTS));
      return INITIAL_CAMPUS_EVENTS;
    } catch (e) {
      console.warn('Error loading campus events:', e);
      return INITIAL_CAMPUS_EVENTS;
    }
  },

  addEvent: async (eventData, user) => {
    if (!checkIsAdmin(user)) {
      throw new Error('Access Denied: Only campus administrators have authority to publish college events.');
    }

    const currentEvents = await campusEventsService.getEvents();
    const newEvent = {
      id: `evt-${Date.now()}`,
      title: eventData.title.trim(),
      category: (eventData.category || 'CAMPUS EVENT').toUpperCase(),
      status: (eventData.status || 'UPCOMING').toUpperCase(),
      statusVariant: eventData.statusVariant || 'success',
      time: eventData.time || 'Upcoming · Check Timetable',
      venue: eventData.venue || 'Campus Venue',
      destCode: eventData.destCode || 'as-block',
      createdBy: user.name || 'Campus Administrator',
      isOfficial: true,
      createdAt: new Date().toISOString()
    };

    const updated = [newEvent, ...currentEvents];
    await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  // --- LOST & FOUND API ---
  getLostFoundItems: async () => {
    try {
      const stored = await AsyncStorage.getItem(LOST_FOUND_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      await AsyncStorage.setItem(LOST_FOUND_STORAGE_KEY, JSON.stringify(INITIAL_LOST_FOUND));
      return INITIAL_LOST_FOUND;
    } catch (e) {
      console.warn('Error loading lost & found:', e);
      return INITIAL_LOST_FOUND;
    }
  },

  addLostFoundItem: async (itemData, user) => {
    if (!checkIsAdmin(user)) {
      throw new Error('Access Denied: Only campus administrators have authority to register items in Lost & Found.');
    }

    const currentItems = await campusEventsService.getLostFoundItems();
    
    let typeBg = 'rgba(16, 185, 129, 0.12)';
    let typeColor = '#059669';
    const typeUpper = (itemData.type || 'FOUND').toUpperCase();

    if (typeUpper === 'DEPOSITED') {
      typeBg = 'rgba(59, 130, 246, 0.12)';
      typeColor = '#2563EB';
    } else if (typeUpper === 'REPORTED LOST' || typeUpper === 'LOST') {
      typeBg = 'rgba(234, 162, 40, 0.15)';
      typeColor = '#B45309';
    }

    const newItem = {
      id: `lf-${Date.now()}`,
      title: itemData.title.trim(),
      type: typeUpper,
      typeBg,
      typeColor,
      location: itemData.location ? `Found at ${itemData.location}` : 'Campus Ground',
      desk: itemData.desk || 'Main Gate Security Office',
      destCode: itemData.destCode || 'main-gate',
      time: 'Just now',
      claimed: false,
      claimedBy: null,
      addedBy: user.name || 'Campus Administrator',
      createdAt: new Date().toISOString()
    };

    const updated = [newItem, ...currentItems];
    await AsyncStorage.setItem(LOST_FOUND_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  claimItem: async (itemId, claimDetails, user) => {
    const currentItems = await campusEventsService.getLostFoundItems();
    const updated = currentItems.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          claimed: true,
          type: 'CLAIM PENDING',
          typeBg: 'rgba(99, 102, 241, 0.12)',
          typeColor: '#4F46E5',
          claimedBy: {
            name: claimDetails.name || user?.name || 'Verified Claimant',
            studentId: claimDetails.studentId || user?.rollNumber || 'ID Verified',
            phone: claimDetails.phone || '',
            claimedAt: new Date().toLocaleString()
          }
        };
      }
      return item;
    });

    await AsyncStorage.setItem(LOST_FOUND_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
};
