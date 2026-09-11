import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Platform,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { 
  Compass, 
  CalendarDays, 
  Package, 
  Activity, 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  Building2, 
  BookOpen,
  Bot,
  QrCode,
  Search, 
  Clock,
  ShieldCheck,
  CalendarCheck,
  AlertCircle,
  Trophy,
  HelpCircle,
  ChevronRight,
  Plus,
  X,
  Lock,
  Check
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { HeaderBar } from '../components/common/HeaderBar';
import { WeatherWidget } from '../components/common/WeatherWidget';
import { EmergencyWidget } from '../components/common/EmergencyWidget';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { campusEventsService, checkIsAdmin } from '../services/campusEventsAndLostFound';

const HIGHLIGHT_PLACES = [
  { 
    id: 'learning_center', 
    name: 'BIT Learning Center', 
    meta: 'Library · Open until 11:00 PM', 
    icon: BookOpen, 
    status: 'Open',
    destCode: 'library' 
  },
  { 
    id: 'as_block', 
    name: 'AS Academic Block', 
    meta: 'Academic · 4 Floors · 428 Classrooms', 
    icon: Building2, 
    status: 'Active',
    destCode: 'as-block' 
  },
  { 
    id: 'cafeteria', 
    name: 'Central Campus Cafeteria', 
    meta: 'Dining & Food Court · Open until 9:30 PM', 
    icon: Sparkles, 
    status: 'Serving',
    destCode: 'canteen' 
  },
];

const CAMPUS_EVENTS = [
  {
    id: 'event-1',
    title: 'National AI & Spatial Robotics Symposium 2026',
    category: 'KEYNOTE & TECH EXPO',
    time: 'Today · 10:00 AM – 04:30 PM',
    venue: 'Vedhanayagam Auditorium',
    destCode: 'auditorium',
    status: 'LIVE EVENT',
    statusVariant: 'danger',
    audience: 'Registered Delegates & Students',
    icon: Sparkles
  },
  {
    id: 'event-2',
    title: 'Smart Campus 24-Hour AI Hackathon',
    category: 'INNOVATION HACKATHON',
    time: 'Tomorrow · Starts 09:00 AM',
    venue: 'AS Academic Block · Special Labs Floor 2',
    destCode: 'as-block',
    status: 'STARTS TOMORROW',
    statusVariant: 'warning',
    audience: 'Engineering & CS Teams',
    icon: Building2
  },
  {
    id: 'event-3',
    title: 'BIT Inter-Collegiate Athletics Championship',
    category: 'ANNUAL SPORTS MEET',
    time: 'Saturday · 07:30 AM onwards',
    venue: 'BIT Sports Arena & Athletic Grounds',
    destCode: 'sports-ground',
    status: 'OPEN ENTRY',
    statusVariant: 'success',
    audience: 'All Campus Visitors & Athletes',
    icon: Trophy
  }
];

const RECENT_LOST_FOUND = [
  {
    id: 'lf-1',
    title: 'Casio fx-991CW Scientific Calculator',
    type: 'FOUND',
    typeColor: colors.accent,
    typeBg: 'rgba(16, 185, 129, 0.12)',
    location: 'Found near AS Block Floor 2 Corridor',
    desk: 'AS Block Department Office',
    destCode: 'as-block',
    time: '2 hours ago'
  },
  {
    id: 'lf-2',
    title: 'Student ID Card & RFID Lanyard',
    type: 'DEPOSITED',
    typeColor: '#2563EB',
    typeBg: 'rgba(37, 99, 235, 0.12)',
    location: 'Found near Central Campus Cafeteria',
    desk: 'Main Gate Security Office',
    destCode: 'main-gate',
    time: 'Today · 11:30 AM'
  },
  {
    id: 'lf-3',
    title: 'Apple 140W USB-C Power Adapter',
    type: 'REPORTED LOST',
    typeColor: colors.warning,
    typeBg: 'rgba(245, 158, 11, 0.12)',
    location: 'Reported lost at Learning Center Library Floor 1',
    desk: 'Library Help Desk',
    destCode: 'library',
    time: 'Yesterday · 04:15 PM'
  }
];

export const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const isAdmin = checkIsAdmin(user);

  const [stats, setStats] = useState({
    activeRoutesCount: 14,
    totalBookings: 8,
    connectedNodes: 320,
    campusOccupancy: '74%'
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [lostFoundItems, setLostFoundItems] = useState([]);

  // Modals
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showAddLostModal, setShowAddLostModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedClaimItem, setSelectedClaimItem] = useState(null);

  // Forms
  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'KEYNOTE & TECH EXPO',
    status: 'LIVE EVENT',
    statusVariant: 'danger',
    time: 'Today · 10:00 AM – 04:30 PM',
    venue: 'Vedhanayagam Auditorium',
    destCode: 'auditorium'
  });

  const [lostForm, setLostForm] = useState({
    title: '',
    type: 'FOUND',
    location: 'AS Block Floor 2 Corridor',
    desk: 'AS Block Department Office',
    destCode: 'as-block'
  });

  const [claimForm, setClaimForm] = useState({
    name: user?.name || '',
    studentId: user?.rollNumber || '',
    phone: '',
    notes: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const bookingsRes = await apiService.getMyBookings();
        if (bookingsRes?.data) {
          setRecentBookings(bookingsRes.data.slice(0, 3));
        }
      } catch (e) {}

      try {
        const loadedEvents = await campusEventsService.getEvents();
        setEvents(loadedEvents);
        const loadedLF = await campusEventsService.getLostFoundItems();
        setLostFoundItems(loadedLF);
      } catch (e) {}
    };
    loadData();
  }, []);

  const handleCreateEvent = async () => {
    if (!isAdmin) {
      Alert.alert('Authority Restricted', 'Only campus administrators can publish college events.');
      return;
    }
    if (!eventForm.title.trim()) {
      Alert.alert('Title Required', 'Please provide a title for the campus event.');
      return;
    }
    try {
      const updated = await campusEventsService.addEvent(eventForm, user);
      setEvents(updated);
      setShowAddEventModal(false);
      setEventForm({
        title: '',
        category: 'KEYNOTE & TECH EXPO',
        status: 'LIVE EVENT',
        statusVariant: 'danger',
        time: 'Today · 10:00 AM – 04:30 PM',
        venue: 'Vedhanayagam Auditorium',
        destCode: 'auditorium'
      });
      Alert.alert('Event Published', 'The event has been successfully registered and is now live for all students and attendees to navigate.');
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to publish event.');
    }
  };

  const handleCreateLostItem = async () => {
    if (!isAdmin) {
      Alert.alert('Authority Restricted', 'Only campus administrators can register lost or found items.');
      return;
    }
    if (!lostForm.title.trim()) {
      Alert.alert('Title Required', 'Please enter the item name or description.');
      return;
    }
    try {
      const updated = await campusEventsService.addLostFoundItem(lostForm, user);
      setLostFoundItems(updated);
      setShowAddLostModal(false);
      setLostForm({
        title: '',
        type: 'FOUND',
        location: 'AS Block Floor 2 Corridor',
        desk: 'AS Block Department Office',
        destCode: 'as-block'
      });
      Alert.alert('Item Registered', 'Item has been logged into the Campus Lost & Found Directory.');
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to register item.');
    }
  };

  const handleOpenClaim = (item) => {
    setSelectedClaimItem(item);
    setClaimForm({
      name: user?.name || '',
      studentId: user?.rollNumber || '',
      phone: '',
      notes: ''
    });
    setShowClaimModal(true);
  };

  const handleSubmitClaim = async () => {
    if (!selectedClaimItem) return;
    try {
      const updated = await campusEventsService.claimItem(selectedClaimItem.id, claimForm, user);
      setLostFoundItems(updated);
      const targetDesk = selectedClaimItem.desk;
      const targetDest = selectedClaimItem.destCode;
      setShowClaimModal(false);
      
      Alert.alert(
        'Claim Registered',
        `Your verification request for "${selectedClaimItem.title}" has been registered. We are now routing you to ${targetDesk} for physical collection.`,
        [
          {
            text: 'Navigate to Reclaim Desk',
            onPress: () => navigateToDestination(targetDest, targetDesk)
          }
        ]
      );
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to process claim.');
    }
  };

  const userName = user?.name?.split(' ')[0] || 'Alex';

  const navigateToDestination = (destCode, venueName) => {
    navigation.navigate('Navigation', { 
      destCode: destCode,
      targetLocation: destCode,
      venueName: venueName 
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        title="Dashboard"
        subtitle="BIT Spatial Command & Navigation"
        navigation={navigation}
      />

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrap}>
          {/* Top Operational Status Banner */}
          <View style={styles.statusBannerRow}>
            <View style={styles.statusPill}>
              <View style={styles.statusDotWrapper}>
                <View style={styles.statusDotCore} />
              </View>
              <Text style={styles.statusText}>All campus services & Dijkstra road network operational</Text>
            </View>

            <TouchableOpacity 
              style={styles.qrScanPill}
              onPress={() => navigation.navigate('Bookings')}
              activeOpacity={0.8}
            >
              <QrCode size={14} color={colors.text} />
              <Text style={styles.qrScanText}>Scan Digital Pass</Text>
            </TouchableOpacity>
          </View>

          {/* Hero Greeting Section */}
          <View style={styles.heroSection}>
            <Text style={styles.heroSuper}>CAMPUSNAV WAYFINDING</Text>
            <Text style={styles.heroTitle}>Good morning, {userName} 👋</Text>
            <Text style={styles.heroSub}>
              Interactive turn-by-turn road navigation, event wayfinding, and facility reservation platform.
            </Text>
          </View>

          {/* 4 Primary Navigation Shortcuts */}
          <View style={styles.shortcutsGrid}>
            <TouchableOpacity
              style={styles.shortcutCard}
              onPress={() => navigation.navigate('Map')}
              activeOpacity={0.85}
            >
              <View style={[styles.shortcutIconBox, { backgroundColor: colors.primary }]}>
                <Compass size={22} color={colors.primaryForeground} strokeWidth={2.2} />
              </View>
              <Text style={styles.shortcutLabel}>Navigate</Text>
              <Text style={styles.shortcutDesc}>Live GPS & GIS</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shortcutCard}
              onPress={() => navigation.navigate('Events')}
              activeOpacity={0.85}
            >
              <View style={[styles.shortcutIconBox, { backgroundColor: colors.secondary }]}>
                <CalendarCheck size={22} color={colors.primaryDark} strokeWidth={2.2} />
              </View>
              <Text style={styles.shortcutLabel}>Events</Text>
              <Text style={styles.shortcutDesc}>Venues & Timings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shortcutCard}
              onPress={() => navigation.navigate('Bookings')}
              activeOpacity={0.85}
            >
              <View style={[styles.shortcutIconBox, { backgroundColor: colors.secondary }]}>
                <CalendarDays size={22} color={colors.text} strokeWidth={2.2} />
              </View>
              <Text style={styles.shortcutLabel}>Bookings</Text>
              <Text style={styles.shortcutDesc}>Classrooms & Labs</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shortcutCard}
              onPress={() => navigation.navigate('LostFound')}
              activeOpacity={0.85}
            >
              <View style={[styles.shortcutIconBox, { backgroundColor: colors.secondary }]}>
                <Search size={22} color={colors.text} strokeWidth={2.2} />
              </View>
              <Text style={styles.shortcutLabel}>Lost & Found</Text>
              <Text style={styles.shortcutDesc}>Report & Reclaim</Text>
            </TouchableOpacity>
          </View>

          {/* CAMPUS EVENTS & DIRECTIONS SECTION (HIGH PRIORITY) */}
          <View style={styles.sectionWrap}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleCol}>
                <Text style={styles.sectionSuper}>CAMPUS HAPPENINGS</Text>
                <Text style={styles.sectionTitle}>Upcoming Events & Venues</Text>
              </View>
              <View style={styles.headerBtnGroup}>
                {isAdmin && (
                  <TouchableOpacity 
                    style={styles.adminAddBtn}
                    onPress={() => setShowAddEventModal(true)}
                    activeOpacity={0.8}
                  >
                    <Plus size={13} color="#24201D" strokeWidth={2.4} />
                    <Text style={styles.adminAddBtnText}>Add Event</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={styles.headerActionBtn}
                  onPress={() => navigation.navigate('Events')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.headerActionText}>All Events</Text>
                  <ArrowRight size={13} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.eventsGrid}>
              {(events.length > 0 ? events : CAMPUS_EVENTS).map((event) => {
                return (
                  <View key={event.id} style={styles.eventCard}>
                    <View style={styles.eventCardContent}>
                      <View style={styles.eventCardTop}>
                        <View style={styles.eventCategoryPill}>
                          <Text style={styles.eventCategoryText}>{event.category}</Text>
                        </View>
                        <View style={[styles.eventStatusBadge, event.statusVariant === 'danger' && styles.eventStatusLive]}>
                          <Text style={[styles.eventStatusText, event.statusVariant === 'danger' && styles.eventStatusLiveText]}>
                            {event.status}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.eventTitle} numberOfLines={2}>
                        {event.title}
                      </Text>
                      
                      <View style={styles.eventMetaBlock}>
                        <View style={styles.eventInfoRow}>
                          <Clock size={14} color={colors.textMuted} />
                          <Text style={styles.eventInfoText}>{event.time}</Text>
                        </View>

                        <View style={styles.eventVenueRow}>
                          <MapPin size={14} color={colors.primaryDark} />
                          <Text style={styles.eventVenueText} numberOfLines={1}>
                            {event.venue}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* 1-Click Navigate to Event Button - Strictly pinned at bottom for identical baseline */}
                    <TouchableOpacity
                      style={styles.eventNavBtn}
                      onPress={() => navigateToDestination(event.destCode, event.venue)}
                      activeOpacity={0.85}
                    >
                      <Compass size={15} color={colors.primaryForeground} strokeWidth={2.4} />
                      <Text style={styles.eventNavBtnText}>Navigate to Event</Text>
                      <ArrowRight size={14} color={colors.primaryForeground} style={{ marginLeft: 'auto' }} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>

          {/* CAMPUS LOST & FOUND HUB */}
          <View style={styles.sectionWrap}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleCol}>
                <Text style={styles.sectionSuper}>CAMPUS COMMUNITY</Text>
                <Text style={styles.sectionTitle}>Lost & Found Directory</Text>
              </View>
              <View style={styles.headerBtnGroup}>
                {isAdmin && (
                  <TouchableOpacity 
                    style={styles.adminAddBtn}
                    onPress={() => setShowAddLostModal(true)}
                    activeOpacity={0.8}
                  >
                    <Plus size={13} color="#24201D" strokeWidth={2.4} />
                    <Text style={styles.adminAddBtnText}>Log Item</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={styles.headerActionBtn}
                  onPress={() => navigation.navigate('LostFound')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.headerActionText}>Directory</Text>
                  <ArrowRight size={13} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.lostFoundGrid}>
              {(lostFoundItems.length > 0 ? lostFoundItems : RECENT_LOST_FOUND).map((item) => (
                <View key={item.id} style={styles.lostFoundCard}>
                  <View style={styles.lfCardContent}>
                    <View style={styles.lfTopRow}>
                      <View style={[styles.lfTypePill, { backgroundColor: item.typeBg }]}>
                        <Text style={[styles.lfTypeText, { color: item.typeColor }]}>{item.type}</Text>
                      </View>
                      <Text style={styles.lfTimeText}>{item.time}</Text>
                    </View>

                    <Text style={styles.lfTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    
                    <View style={styles.lfMetaBlock}>
                      <View style={styles.lfMetaRow}>
                        <AlertCircle size={13} color={colors.textMuted} />
                        <Text style={styles.lfLocationText} numberOfLines={1}>{item.location}</Text>
                      </View>

                      <View style={styles.lfDeskRow}>
                        <ShieldCheck size={13} color={colors.accent} />
                        <Text style={styles.lfDeskText} numberOfLines={1}>
                          Collect: <Text style={{ fontWeight: '800', color: colors.text }}>{item.desk}</Text>
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.lfActionRow}>
                    <TouchableOpacity
                      style={[styles.lfNavBtn, item.claimed && styles.lfNavBtnClaimed]}
                      onPress={() => handleOpenClaim(item)}
                      activeOpacity={0.8}
                    >
                      <Compass size={13} color={item.claimed ? colors.primaryDark : colors.text} />
                      <Text style={[styles.lfNavBtnText, item.claimed && { color: colors.primaryDark }]}>
                        {item.claimed ? 'Claim Pending ↗' : 'Reclaim'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.lfReportBtn}
                      onPress={() => handleOpenClaim(item)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.lfReportBtnText}>Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Campus AI Assistant RAG Banner */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Chatbot')}
            style={styles.aiBannerWrap}
          >
            <View style={styles.aiBanner}>
              <View style={styles.aiBannerTop}>
                <View style={styles.aiIconBadge}>
                  <Sparkles size={20} color={colors.primaryForeground} />
                </View>
                <View style={styles.aiTextCol}>
                  <Text style={styles.aiBannerSuper}>CAMPUS ASSISTANT</Text>
                  <Text style={styles.aiBannerTitle}>How can I help you navigate today?</Text>
                </View>
                <View style={styles.askAiButton}>
                  <Text style={styles.askAiButtonText}>Ask AI</Text>
                  <ArrowRight size={14} color={colors.primaryForeground} />
                </View>
              </View>

              <View style={styles.aiPromptRow}>
                <View style={styles.aiPromptChip}>
                  <Text style={styles.aiPromptChipText}>📍 Find Auditorium & Event Gates</Text>
                </View>
                <View style={styles.aiPromptChip}>
                  <Text style={styles.aiPromptChipText}>⏰ Hostel entry & curfew rules</Text>
                </View>
                <View style={styles.aiPromptChip}>
                  <Text style={styles.aiPromptChipText}>📋 15-minute booking grace rule</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Facility Bookings & Passes */}
          <View style={styles.sectionWrap}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleCol}>
                <Text style={styles.sectionSuper}>MY RESERVATIONS</Text>
                <Text style={styles.sectionTitle}>Facility Bookings & Passes</Text>
              </View>
              <TouchableOpacity 
                style={styles.headerActionBtn}
                onPress={() => navigation.navigate('Bookings')}
                activeOpacity={0.8}
              >
                <Text style={styles.headerActionText}>View all ↗</Text>
              </TouchableOpacity>
            </View>

            {recentBookings.length > 0 ? (
              <View style={styles.bookingsList}>
                {recentBookings.map((b) => (
                  <View key={b._id} style={styles.bookingCard}>
                    <View style={styles.bookingTopRow}>
                      <View style={styles.bookingIconWrap}>
                        <CalendarDays size={18} color={colors.text} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.bookingRoomName}>{b.room?.name || 'Classroom / Lab'}</Text>
                        <Text style={styles.bookingPurpose}>{b.purpose || 'Academic Reservation'}</Text>
                      </View>
                      <View style={styles.bookingBadge}>
                        <Text style={styles.bookingBadgeText}>{b.status || 'Approved'}</Text>
                      </View>
                    </View>
                    <View style={styles.bookingTimeRow}>
                      <Clock size={13} color={colors.textMuted} />
                      <Text style={styles.bookingTimeText}>{b.startTime || '10:00 AM'} – {b.endTime || '12:00 PM'}</Text>
                      
                      <TouchableOpacity 
                        style={styles.bookingNavShortcut}
                        onPress={() => navigateToDestination(b.room?.building || 'as-block', b.room?.name)}
                        activeOpacity={0.8}
                      >
                        <Compass size={13} color={colors.primaryDark} />
                        <Text style={styles.bookingNavShortcutText}>Navigate</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyBookingsCard}>
                <View style={styles.emptyIconBox}>
                  <CalendarDays size={28} color={colors.textMuted} />
                </View>
                <Text style={styles.emptyTitle}>No active facility passes</Text>
                <Text style={styles.emptySubtitle}>Reserve a computer lab, seminar pod, or classroom with instant digital QR check-in.</Text>
                <TouchableOpacity
                  style={styles.reserveButton}
                  onPress={() => navigation.navigate('Bookings')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.reserveButtonText}>Reserve a Facility Now</Text>
                  <ArrowRight size={15} color={colors.primaryForeground} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Interactive Map Quick Launcher Card */}
          <View style={styles.sectionWrap}>
            <View style={styles.mapLauncherCard}>
              <View style={styles.mapLauncherContent}>
                <View style={styles.mapLauncherIconBadge}>
                  <Compass size={24} color={colors.primaryForeground} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.mapLauncherSuper}>FULL CAMPUS GIS WAYFINDING</Text>
                  <Text style={styles.mapLauncherTitle}>Turn-by-Turn Road Dijkstra Map</Text>
                  <Text style={styles.mapLauncherDesc}>320 road junctions, 428 classroom nodes, pedestrian pathways, and vehicle routes.</Text>
                </View>
                <TouchableOpacity
                  style={styles.mapLauncherBtn}
                  onPress={() => navigation.navigate('Map')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.mapLauncherBtnText}>Open Interactive Map</Text>
                  <ArrowRight size={15} color={colors.primaryForeground} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Operational Metrics (4-stat row) */}
          <View style={styles.sectionWrap}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleCol}>
                <Text style={styles.sectionSuper}>SYSTEM METRICS</Text>
                <Text style={styles.sectionTitle}>Live Campus Telemetry</Text>
              </View>
              <View style={styles.liveIndicatorPill}>
                <View style={styles.liveIndicatorDot} />
                <Text style={styles.liveIndicatorText}>Live Feed</Text>
              </View>
            </View>

            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricTitle}>Active Wayfinders</Text>
                  <View style={styles.metricIconWrap}>
                    <Compass size={16} color={colors.primaryDark} />
                  </View>
                </View>
                <Text style={styles.metricBigNum}>{stats.activeRoutesCount}</Text>
                <Text style={styles.metricSubtitle}>+12% higher than yesterday</Text>
              </View>

              <View style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricTitle}>Campus Occupancy</Text>
                  <View style={styles.metricIconWrap}>
                    <Activity size={16} color={colors.accent} />
                  </View>
                </View>
                <Text style={styles.metricBigNum}>{stats.campusOccupancy}</Text>
                <Text style={styles.metricSubtitle}>Peak period · 11 AM–1 PM</Text>
              </View>

              <View style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricTitle}>Dijkstra Road Nodes</Text>
                  <View style={styles.metricIconWrap}>
                    <MapPin size={16} color={colors.primaryDark} />
                  </View>
                </View>
                <Text style={styles.metricBigNum}>{stats.connectedNodes}</Text>
                <Text style={styles.metricSubtitle}>320 Road Graph Junctions</Text>
              </View>

              <View style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricTitle}>Digital Passes</Text>
                  <View style={styles.metricIconWrap}>
                    <CalendarDays size={16} color={colors.purple} />
                  </View>
                </View>
                <Text style={styles.metricBigNum}>{stats.totalBookings}</Text>
                <Text style={styles.metricSubtitle}>Approved Room Passes</Text>
              </View>
            </View>
          </View>

          {/* Live Weather & Emergency SOS Section */}
          <WeatherWidget />
          <EmergencyWidget />

        </View>
      </ScrollView>

      {/* ADMIN: PUBLISH CAMPUS EVENT MODAL */}
      <Modal
        visible={showAddEventModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddEventModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <View style={styles.adminBadgeRow}>
                  <Lock size={12} color={colors.primaryDark} />
                  <Text style={styles.adminBadgeText}>ADMIN AUTHORITY</Text>
                </View>
                <Text style={styles.modalTitle}>Publish College Event</Text>
                <Text style={styles.modalSubtitle}>Broadcast officially to campus wayfinding</Text>
              </View>
              <TouchableOpacity 
                style={styles.modalCloseBtn}
                onPress={() => setShowAddEventModal(false)}
              >
                <X size={18} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalFormBody}>
              <Text style={styles.inputLabel}>Event Title *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Smart Mobility & AI Symposium 2026"
                placeholderTextColor={colors.textMuted}
                value={eventForm.title}
                onChangeText={(t) => setEventForm({ ...eventForm, title: t })}
              />

              <Text style={styles.inputLabel}>Event Category</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="KEYNOTE & TECH EXPO / HACKATHON / SPORTS"
                placeholderTextColor={colors.textMuted}
                value={eventForm.category}
                onChangeText={(t) => setEventForm({ ...eventForm, category: t })}
              />

              <Text style={styles.inputLabel}>Date & Time Schedule</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Tomorrow · 10:00 AM - 04:30 PM"
                placeholderTextColor={colors.textMuted}
                value={eventForm.time}
                onChangeText={(t) => setEventForm({ ...eventForm, time: t })}
              />

              <Text style={styles.inputLabel}>Campus Venue Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Vedhanayagam Auditorium"
                placeholderTextColor={colors.textMuted}
                value={eventForm.venue}
                onChangeText={(t) => setEventForm({ ...eventForm, venue: t })}
              />

              <Text style={styles.inputLabel}>Navigation Destination Landmark</Text>
              <View style={styles.presetDestRow}>
                {['auditorium', 'as-block', 'sports-ground', 'library'].map((code) => (
                  <TouchableOpacity
                    key={code}
                    style={[
                      styles.presetDestChip,
                      eventForm.destCode === code && styles.presetDestChipActive
                    ]}
                    onPress={() => setEventForm({ ...eventForm, destCode: code })}
                  >
                    <Text style={[
                      styles.presetDestChipText,
                      eventForm.destCode === code && styles.presetDestChipTextActive
                    ]}>
                      {code}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalCancelBtn}
                onPress={() => setShowAddEventModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSubmitBtn}
                onPress={handleCreateEvent}
              >
                <Plus size={16} color={colors.primaryForeground} strokeWidth={2.5} />
                <Text style={styles.modalSubmitText}>Publish Event</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ADMIN: LOG LOST & FOUND ITEM MODAL */}
      <Modal
        visible={showAddLostModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddLostModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <View style={styles.adminBadgeRow}>
                  <Lock size={12} color={colors.primaryDark} />
                  <Text style={styles.adminBadgeText}>CAMPUS CUSTODY REGISTRY</Text>
                </View>
                <Text style={styles.modalTitle}>Register Lost / Found Item</Text>
                <Text style={styles.modalSubtitle}>Admin security protocol for displaced property</Text>
              </View>
              <TouchableOpacity 
                style={styles.modalCloseBtn}
                onPress={() => setShowAddLostModal(false)}
              >
                <X size={18} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalFormBody}>
              <Text style={styles.inputLabel}>Item Name / Description *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Casio fx-991CW Calculator or HP Laptop"
                placeholderTextColor={colors.textMuted}
                value={lostForm.title}
                onChangeText={(t) => setLostForm({ ...lostForm, title: t })}
              />

              <Text style={styles.inputLabel}>Registry Classification</Text>
              <View style={styles.presetDestRow}>
                {['FOUND', 'DEPOSITED', 'REPORTED LOST'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.presetDestChip,
                      lostForm.type === type && styles.presetDestChipActive
                    ]}
                    onPress={() => setLostForm({ ...lostForm, type })}
                  >
                    <Text style={[
                      styles.presetDestChipText,
                      lostForm.type === type && styles.presetDestChipTextActive
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Spotted / Discovered Location</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. AS Block Floor 2 Corridor (Near Room AS-204)"
                placeholderTextColor={colors.textMuted}
                value={lostForm.location}
                onChangeText={(t) => setLostForm({ ...lostForm, location: t })}
              />

              <Text style={styles.inputLabel}>Custody Collection Desk</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. AS Block Department Office or Main Gate Post"
                placeholderTextColor={colors.textMuted}
                value={lostForm.desk}
                onChangeText={(t) => setLostForm({ ...lostForm, desk: t })}
              />

              <Text style={styles.inputLabel}>Reclaim Landmark Junction</Text>
              <View style={styles.presetDestRow}>
                {['as-block', 'main-gate', 'library', 'sports-ground'].map((code) => (
                  <TouchableOpacity
                    key={code}
                    style={[
                      styles.presetDestChip,
                      lostForm.destCode === code && styles.presetDestChipActive
                    ]}
                    onPress={() => setLostForm({ ...lostForm, destCode: code })}
                  >
                    <Text style={[
                      styles.presetDestChipText,
                      lostForm.destCode === code && styles.presetDestChipTextActive
                    ]}>
                      {code}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalCancelBtn}
                onPress={() => setShowAddLostModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSubmitBtn}
                onPress={handleCreateLostItem}
              >
                <Plus size={16} color={colors.primaryForeground} strokeWidth={2.5} />
                <Text style={styles.modalSubmitText}>Register Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* CLAIM ITEM MODAL (OPEN TO ANY USER) */}
      <Modal
        visible={showClaimModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowClaimModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <View style={styles.claimBadgeRow}>
                  <ShieldCheck size={13} color="#059669" />
                  <Text style={styles.claimBadgeText}>OWNERSHIP CLAIM PROTOCOL</Text>
                </View>
                <Text style={styles.modalTitle}>Reclaim Displaced Item</Text>
                <Text style={styles.modalSubtitle}>Submit verification & receive physical collection route</Text>
              </View>
              <TouchableOpacity 
                style={styles.modalCloseBtn}
                onPress={() => setShowClaimModal(false)}
              >
                <X size={18} color={colors.text} />
              </TouchableOpacity>
            </View>

            {selectedClaimItem && (
              <View style={styles.itemSummaryBox}>
                <Text style={styles.summaryItemTitle}>{selectedClaimItem.title}</Text>
                <Text style={styles.summaryItemLocation}>📍 Location: {selectedClaimItem.location}</Text>
                <Text style={styles.summaryItemDesk}>🏛 Holding Desk: <Text style={{ fontWeight: '800' }}>{selectedClaimItem.desk}</Text></Text>
              </View>
            )}

            <ScrollView style={styles.modalFormBody}>
              <Text style={styles.inputLabel}>Claimant Full Name *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Your full name"
                placeholderTextColor={colors.textMuted}
                value={claimForm.name}
                onChangeText={(t) => setClaimForm({ ...claimForm, name: t })}
              />

              <Text style={styles.inputLabel}>Student / Employee ID or Roll Number *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. 7376221CS101"
                placeholderTextColor={colors.textMuted}
                value={claimForm.studentId}
                onChangeText={(t) => setClaimForm({ ...claimForm, studentId: t })}
              />

              <Text style={styles.inputLabel}>Contact Phone / Extension</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="+91 98765 43210"
                placeholderTextColor={colors.textMuted}
                value={claimForm.phone}
                onChangeText={(t) => setClaimForm({ ...claimForm, phone: t })}
              />

              <Text style={styles.inputLabel}>Proof of Ownership / Distinctive Features</Text>
              <TextInput
                style={[styles.modalInput, { height: 64, textAlignVertical: 'top' }]}
                placeholder="Color, serial number, wallpaper, stickers, or specific contents..."
                placeholderTextColor={colors.textMuted}
                multiline={true}
                value={claimForm.notes}
                onChangeText={(t) => setClaimForm({ ...claimForm, notes: t })}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalCancelBtn}
                onPress={() => setShowClaimModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSubmitBtn}
                onPress={handleSubmitClaim}
              >
                <Compass size={16} color={colors.primaryForeground} strokeWidth={2.4} />
                <Text style={styles.modalSubmitText}>Claim & Navigate to Desk</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  container: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 60
  },
  contentWrap: {
    maxWidth: 1140,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingTop: 16
  },

  // Status Banner
  statusBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 10
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  statusDotWrapper: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusDotCore: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669'
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondaryForeground,
    fontFamily: 'Manrope'
  },
  qrScanPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.cardBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  qrScanText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Manrope'
  },

  // Hero Section
  heroSection: {
    marginBottom: 20
  },
  heroSuper: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1.2,
    fontFamily: 'Outfit',
    marginBottom: 4
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.6,
    fontFamily: 'Outfit',
    marginBottom: 6
  },
  heroSub: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Manrope',
    lineHeight: 20
  },

  // 4 Shortcuts Grid
  shortcutsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    flexWrap: 'wrap'
  },
  shortcutCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: colors.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'flex-start',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px -2px rgba(36, 32, 29, 0.05)'
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2
      }
    })
  },
  shortcutIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  shortcutLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Outfit',
    marginBottom: 2
  },
  shortcutDesc: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: 'Manrope'
  },

  // Section Headers
  sectionWrap: {
    marginBottom: 24
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  sectionTitleCol: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 2
  },
  sectionSuper: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1.2,
    fontFamily: 'Outfit',
    marginBottom: 2
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Outfit',
    letterSpacing: -0.3
  },
  headerBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  adminAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px -1px rgba(234, 162, 40, 0.4)'
      }
    })
  },
  adminAddBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryForeground,
    fontFamily: 'Outfit'
  },
  headerActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  headerActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Manrope'
  },

  // CAMPUS EVENTS STYLES
  eventsGrid: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 14,
    flexWrap: 'wrap'
  },
  eventCard: {
    flex: 1,
    minWidth: 280,
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px -2px rgba(36, 32, 29, 0.05)',
        display: 'flex'
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2
      }
    })
  },
  eventCardContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginBottom: 16
  },
  eventCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  eventCategoryPill: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 6
  },
  eventCategoryText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.secondaryForeground,
    fontFamily: 'Outfit',
    letterSpacing: 0.6
  },
  eventStatusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 999
  },
  eventStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    fontFamily: 'Outfit'
  },
  eventStatusLive: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)'
  },
  eventStatusLiveText: {
    color: colors.danger
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Outfit',
    minHeight: 46,
    lineHeight: 22,
    marginBottom: 10,
    ...Platform.select({
      web: {
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }
    })
  },
  eventMetaBlock: {
    marginTop: 'auto',
    gap: 6
  },
  eventInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 20
  },
  eventInfoText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Manrope'
  },
  eventVenueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 22
  },
  eventVenueText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Manrope',
    flex: 1
  },
  eventNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 'auto',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 14px -2px rgba(234, 162, 40, 0.35)'
      }
    })
  },
  eventNavBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryForeground,
    fontFamily: 'Outfit'
  },

  // LOST & FOUND STYLES
  lostFoundGrid: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 14,
    flexWrap: 'wrap'
  },
  lostFoundCard: {
    flex: 1,
    minWidth: 280,
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px -2px rgba(36, 32, 29, 0.05)',
        display: 'flex'
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2
      }
    })
  },
  lfCardContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginBottom: 14
  },
  lfTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  lfTypePill: {
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 6
  },
  lfTypeText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Outfit',
    letterSpacing: 0.5
  },
  lfTimeText: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: 'Manrope'
  },
  lfTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Outfit',
    minHeight: 42,
    lineHeight: 20,
    marginBottom: 8,
    ...Platform.select({
      web: {
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }
    })
  },
  lfMetaBlock: {
    marginTop: 'auto',
    gap: 5
  },
  lfMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 18
  },
  lfLocationText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Manrope',
    flex: 1
  },
  lfDeskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 18
  },
  lfDeskText: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'Manrope',
    flex: 1
  },
  lfActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    marginTop: 'auto'
  },
  lfNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    flex: 1,
    justifyContent: 'center'
  },
  lfNavBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Manrope'
  },
  lfReportBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center'
  },
  lfReportBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Manrope'
  },
  lfNavBtnClaimed: {
    backgroundColor: 'rgba(234, 162, 40, 0.12)',
    borderColor: colors.primary
  },

  // MODAL STYLES (ADMIN ADD & USER CLAIM)
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(6px)'
      }
    })
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 480,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...Platform.select({
      web: {
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10
      }
    })
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  adminBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 0.8,
    fontFamily: 'Outfit'
  },
  claimBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4
  },
  claimBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.8,
    fontFamily: 'Outfit'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    fontFamily: 'Outfit'
  },
  modalSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Manrope',
    marginTop: 2
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemSummaryBox: {
    backgroundColor: colors.secondary,
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  summaryItemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Outfit'
  },
  summaryItemLocation: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Manrope',
    marginTop: 2
  },
  summaryItemDesk: {
    fontSize: 12,
    color: colors.primaryDark,
    fontFamily: 'Manrope',
    marginTop: 2
  },
  modalFormBody: {
    maxHeight: 320,
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Manrope',
    marginTop: 10,
    marginBottom: 4
  },
  modalInput: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.text,
    fontFamily: 'Manrope'
  },
  presetDestRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
    marginBottom: 6
  },
  presetDestChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  presetDestChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  presetDestChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Manrope'
  },
  presetDestChipTextActive: {
    color: colors.primaryForeground
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.secondary
  },
  modalCancelText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Manrope'
  },
  modalSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 14px -2px rgba(234, 162, 40, 0.4)'
      }
    })
  },
  modalSubmitText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryForeground,
    fontFamily: 'Outfit'
  },

  // AI Assistant Banner
  aiBannerWrap: {
    marginBottom: 24
  },
  aiBanner: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 20,
    ...Platform.select({
      web: {
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFDF8 60%, #FEF8EC 100%)',
        boxShadow: '0 4px 20px -4px rgba(234, 162, 40, 0.12), 0 2px 6px -1px rgba(36, 32, 29, 0.04)'
      },
      default: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3
      }
    })
  },
  aiBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14
  },
  aiIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6
  },
  aiTextCol: {
    flex: 1
  },
  aiBannerSuper: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 0.8,
    fontFamily: 'Outfit',
    marginBottom: 2
  },
  aiBannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Outfit'
  },
  askAiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12
  },
  askAiButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryForeground,
    fontFamily: 'Outfit'
  },
  aiPromptRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap'
  },
  aiPromptChip: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  aiPromptChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondaryForeground,
    fontFamily: 'Manrope'
  },

  // Map Quick Launcher Card
  mapLauncherCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 20,
    ...Platform.select({
      web: {
        background: 'linear-gradient(135deg, #FAF8F5 0%, #FFFFFF 100%)',
        boxShadow: '0 2px 8px -2px rgba(36, 32, 29, 0.05)'
      }
    })
  },
  mapLauncherContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap'
  },
  mapLauncherIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8
  },
  mapLauncherSuper: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 0.8,
    fontFamily: 'Outfit',
    marginBottom: 2
  },
  mapLauncherTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Outfit'
  },
  mapLauncherDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Manrope',
    marginTop: 2
  },
  mapLauncherBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12
  },
  mapLauncherBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryForeground,
    fontFamily: 'Outfit'
  },

  // Metrics Grid
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap'
  },
  metricCard: {
    flex: 1,
    minWidth: 180,
    backgroundColor: colors.cardBg,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    fontFamily: 'Manrope'
  },
  metricIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  metricBigNum: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Outfit',
    letterSpacing: -1,
    marginBottom: 4
  },
  metricSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: 'Manrope'
  },
  liveIndicatorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999
  },
  liveIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent
  },
  liveIndicatorText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
    fontFamily: 'Manrope'
  },

  // Bookings List
  bookingsList: {
    gap: 10
  },
  bookingCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  bookingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8
  },
  bookingIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bookingRoomName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Outfit'
  },
  bookingPurpose: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Manrope',
    marginTop: 1
  },
  bookingBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999
  },
  bookingBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.secondaryForeground,
    fontFamily: 'Manrope'
  },
  bookingTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder
  },
  bookingTimeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    fontFamily: 'Manrope'
  },
  bookingNavShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  bookingNavShortcutText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
    fontFamily: 'Manrope'
  },

  // Empty Bookings State
  emptyBookingsCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    textAlign: 'center'
  },
  emptyIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Outfit',
    marginBottom: 4
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Manrope',
    textAlign: 'center',
    maxWidth: 380,
    marginBottom: 16
  },
  reserveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12
  },
  reserveButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryForeground,
    fontFamily: 'Outfit'
  }
});
