import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform
} from 'react-native';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Compass, 
  Plus, 
  X, 
  Lock, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { HeaderBar } from '../components/common/HeaderBar';
import { useAuth } from '../context/AuthContext';
import { campusEventsService, checkIsAdmin, INITIAL_CAMPUS_EVENTS } from '../services/campusEventsAndLostFound';

export const EventsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const isAdmin = checkIsAdmin(user);

  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'KEYNOTE & TECH EXPO',
    status: 'UPCOMING',
    statusVariant: 'success',
    time: 'Tomorrow · 10:00 AM – 04:30 PM',
    venue: 'Vedhanayagam Auditorium',
    destCode: 'auditorium'
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await campusEventsService.getEvents();
      setEvents(data);
    } catch (e) {
      setEvents(INITIAL_CAMPUS_EVENTS);
    }
  };

  const handleCreate = async () => {
    if (!isAdmin) {
      Alert.alert('Authority Restricted', 'Only campus administrators can publish college events.');
      return;
    }
    if (!form.title.trim()) {
      Alert.alert('Title Required', 'Please provide a title for the event.');
      return;
    }
    try {
      const updated = await campusEventsService.addEvent(form, user);
      setEvents(updated);
      setShowModal(false);
      setForm({
        title: '',
        category: 'KEYNOTE & TECH EXPO',
        status: 'UPCOMING',
        statusVariant: 'success',
        time: 'Tomorrow · 10:00 AM – 04:30 PM',
        venue: 'Vedhanayagam Auditorium',
        destCode: 'auditorium'
      });
      Alert.alert('Event Published', 'College event has been broadcasted to all users and is active for navigation.');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const navigateToVenue = (destCode, venueName) => {
    navigation.navigate('Navigation', {
      destCode,
      targetLocation: destCode,
      venueName
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        title="Campus Events & Venues"
        subtitle="Conferences, Hackathons & Official Symposia"
        navigation={navigation}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Admin Broadcast Callout / Action Header */}
        <View style={styles.topControlRow}>
          <View style={styles.authorityIndicator}>
            {isAdmin ? (
              <View style={styles.adminStatusPill}>
                <Lock size={12} color={colors.primaryDark} />
                <Text style={styles.adminStatusText}>Admin Authority Active · You can publish events</Text>
              </View>
            ) : (
              <View style={styles.visitorStatusPill}>
                <ShieldCheck size={12} color="#059669" />
                <Text style={styles.visitorStatusText}>Official Broadcast · Click any venue to navigate</Text>
              </View>
            )}
          </View>

          {isAdmin && (
            <TouchableOpacity
              style={styles.addEventBtn}
              onPress={() => setShowModal(true)}
              activeOpacity={0.85}
            >
              <Plus size={14} color={colors.primaryForeground} strokeWidth={2.4} />
              <Text style={styles.addEventBtnText}>Add Event</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Events List */}
        <View style={styles.list}>
          {(events.length > 0 ? events : INITIAL_CAMPUS_EVENTS).map((evt) => (
            <View key={evt.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{evt.category}</Text>
                </View>
                <View style={[styles.statusBadge, evt.statusVariant === 'danger' && styles.statusBadgeLive]}>
                  <Text style={[styles.statusText, evt.statusVariant === 'danger' && styles.statusTextLive]}>
                    {evt.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.title}>{evt.title}</Text>

              <View style={styles.metaRow}>
                <Clock size={14} color={colors.textMuted} />
                <Text style={styles.metaText}>{evt.time}</Text>
              </View>

              <View style={styles.metaRow}>
                <MapPin size={14} color={colors.primaryDark} />
                <Text style={styles.venueText}>{evt.venue}</Text>
              </View>

              <View style={styles.bottomRow}>
                <View style={styles.officialTag}>
                  <Sparkles size={12} color={colors.textMuted} />
                  <Text style={styles.officialText}>Official Campus Waypoint</Text>
                </View>

                <TouchableOpacity
                  style={styles.navBtn}
                  onPress={() => navigateToVenue(evt.destCode, evt.venue)}
                  activeOpacity={0.85}
                >
                  <Compass size={14} color={colors.primaryForeground} strokeWidth={2.4} />
                  <Text style={styles.navBtnText}>Navigate to Venue</Text>
                  <ArrowRight size={13} color={colors.primaryForeground} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ADMIN ADD EVENT MODAL */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
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
                <Text style={styles.modalSubtitle}>Register an official event for campus navigation</Text>
              </View>
              <TouchableOpacity 
                style={styles.modalCloseBtn}
                onPress={() => setShowModal(false)}
              >
                <X size={18} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalFormBody}>
              <Text style={styles.inputLabel}>Event Title *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. National Robotics & Drone Expo"
                placeholderTextColor={colors.textMuted}
                value={form.title}
                onChangeText={(t) => setForm({ ...form, title: t })}
              />

              <Text style={styles.inputLabel}>Category</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="KEYNOTE & TECH EXPO / HACKATHON / SPORTS"
                placeholderTextColor={colors.textMuted}
                value={form.category}
                onChangeText={(t) => setForm({ ...form, category: t })}
              />

              <Text style={styles.inputLabel}>Date & Time</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Saturday · 09:00 AM - 05:00 PM"
                placeholderTextColor={colors.textMuted}
                value={form.time}
                onChangeText={(t) => setForm({ ...form, time: t })}
              />

              <Text style={styles.inputLabel}>Venue Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Vedhanayagam Auditorium"
                placeholderTextColor={colors.textMuted}
                value={form.venue}
                onChangeText={(t) => setForm({ ...form, venue: t })}
              />

              <Text style={styles.inputLabel}>Destination GIS Landmark</Text>
              <View style={styles.presetDestRow}>
                {['auditorium', 'as-block', 'sports-ground', 'library'].map((code) => (
                  <TouchableOpacity
                    key={code}
                    style={[
                      styles.presetDestChip,
                      form.destCode === code && styles.presetDestChipActive
                    ]}
                    onPress={() => setForm({ ...form, destCode: code })}
                  >
                    <Text style={[
                      styles.presetDestChipText,
                      form.destCode === code && styles.presetDestChipTextActive
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
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSubmitBtn}
                onPress={handleCreate}
              >
                <Plus size={15} color={colors.primaryForeground} strokeWidth={2.4} />
                <Text style={styles.modalSubmitText}>Publish Event</Text>
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
  content: {
    padding: 16,
    paddingBottom: 50,
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center'
  },
  topControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 10
  },
  authorityIndicator: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  adminStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(234, 162, 40, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(234, 162, 40, 0.3)'
  },
  adminStatusText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryDark,
    fontFamily: 'Outfit'
  },
  visitorStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)'
  },
  visitorStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    fontFamily: 'Manrope'
  },
  addEventBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px -2px rgba(234, 162, 40, 0.4)'
      }
    })
  },
  addEventBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryForeground,
    fontFamily: 'Outfit'
  },
  list: {
    gap: 14
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px -2px rgba(36, 32, 29, 0.05)'
      }
    })
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  categoryBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 6
  },
  categoryText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.secondaryForeground,
    fontFamily: 'Outfit',
    letterSpacing: 0.6
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 999
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    fontFamily: 'Outfit'
  },
  statusBadgeLive: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)'
  },
  statusTextLive: {
    color: colors.danger
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Outfit',
    marginBottom: 10,
    lineHeight: 24
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6
  },
  metaText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Manrope'
  },
  venueText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Manrope'
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    flexWrap: 'wrap',
    gap: 10
  },
  officialTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  officialText: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: 'Manrope'
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px -1px rgba(234, 162, 40, 0.35)'
      }
    })
  },
  navBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryForeground,
    fontFamily: 'Outfit'
  },

  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 480,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14
  },
  adminBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryDark,
    fontFamily: 'Outfit',
    letterSpacing: 0.8
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
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
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
    gap: 5,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10
  },
  modalSubmitText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryForeground,
    fontFamily: 'Outfit'
  }
});
