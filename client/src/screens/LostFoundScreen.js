import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  Alert,
  Modal,
  Platform
} from 'react-native';
import { 
  Search, 
  Plus, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  Compass, 
  Lock, 
  X, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { HeaderBar } from '../components/common/HeaderBar';
import { useAuth } from '../context/AuthContext';
import { campusEventsService, checkIsAdmin, INITIAL_LOST_FOUND } from '../services/campusEventsAndLostFound';

export const LostFoundScreen = ({ navigation }) => {
  const { user } = useAuth();
  const isAdmin = checkIsAdmin(user);

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Admin Add Form
  const [addForm, setAddForm] = useState({
    title: '',
    type: 'FOUND',
    location: 'AS Academic Block Floor 2',
    desk: 'AS Block Department Office',
    destCode: 'as-block'
  });

  // User Claim Form
  const [claimForm, setClaimForm] = useState({
    name: user?.name || '',
    studentId: user?.rollNumber || '',
    phone: '',
    notes: ''
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await campusEventsService.getLostFoundItems();
      setItems(data);
    } catch (e) {
      setItems(INITIAL_LOST_FOUND);
    }
  };

  const handleCreate = async () => {
    if (!isAdmin) {
      Alert.alert('Authority Restricted', 'Only campus administrators can register items in the Lost & Found directory.');
      return;
    }
    if (!addForm.title.trim()) {
      Alert.alert('Title Required', 'Please provide a title or description for the displaced item.');
      return;
    }
    try {
      const updated = await campusEventsService.addLostFoundItem(addForm, user);
      setItems(updated);
      setShowAddModal(false);
      setAddForm({
        title: '',
        type: 'FOUND',
        location: 'AS Academic Block Floor 2',
        desk: 'AS Block Department Office',
        destCode: 'as-block'
      });
      Alert.alert('Item Registered', 'The item has been logged into the Campus Custody Directory.');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleOpenClaim = (item) => {
    setSelectedItem(item);
    setClaimForm({
      name: user?.name || '',
      studentId: user?.rollNumber || '',
      phone: '',
      notes: ''
    });
    setShowClaimModal(true);
  };

  const handleSubmitClaim = async () => {
    if (!selectedItem) return;
    try {
      const updated = await campusEventsService.claimItem(selectedItem.id, claimForm, user);
      setItems(updated);
      const targetDesk = selectedItem.desk;
      const targetDest = selectedItem.destCode;
      setShowClaimModal(false);

      Alert.alert(
        'Claim Registered',
        `Verification request for "${selectedItem.title}" recorded. Navigate to ${targetDesk} for physical collection.`,
        [
          {
            text: 'Navigate to Reclaim Desk',
            onPress: () => {
              navigation.navigate('Navigation', {
                destCode: targetDest,
                targetLocation: targetDest,
                venueName: targetDesk
              });
            }
          },
          { text: 'OK' }
        ]
      );
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const filtered = items.filter((i) => {
    const matchesSearch = 
      i.title.toLowerCase().includes(search.toLowerCase()) || 
      i.location.toLowerCase().includes(search.toLowerCase()) ||
      i.desk?.toLowerCase().includes(search.toLowerCase());
    
    if (activeFilter === 'ALL') return matchesSearch;
    if (activeFilter === 'FOUND') return matchesSearch && i.type === 'FOUND';
    if (activeFilter === 'LOST') return matchesSearch && (i.type === 'REPORTED LOST' || i.type === 'LOST');
    if (activeFilter === 'CLAIMED') return matchesSearch && (i.claimed || i.type === 'CLAIM PENDING');
    return matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        title="Campus Lost & Found Desk"
        subtitle="Official Custody Registry & Displaced Property Reclaim"
        navigation={navigation}
      />

      <View style={styles.container}>
        {/* Top Control Row */}
        <View style={styles.topControlRow}>
          <View style={styles.authorityIndicator}>
            {isAdmin ? (
              <View style={styles.adminStatusPill}>
                <Lock size={12} color={colors.primaryDark} />
                <Text style={styles.adminStatusText}>Admin Authority Active · You can register items</Text>
              </View>
            ) : (
              <View style={styles.visitorStatusPill}>
                <ShieldCheck size={12} color="#059669" />
                <Text style={styles.visitorStatusText}>Public Registry · Click any item to claim & navigate</Text>
              </View>
            )}
          </View>

          {isAdmin && (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setShowAddModal(true)}
              activeOpacity={0.85}
            >
              <Plus size={14} color={colors.primaryForeground} strokeWidth={2.4} />
              <Text style={styles.addBtnText}>Log New Item</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search Bar & Filter Chips */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Search size={16} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by item name, room, or reclaim desk..."
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <X size={14} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.filterChipsRow}>
            {['ALL', 'FOUND', 'LOST', 'CLAIMED'].map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
                onPress={() => setActiveFilter(f)}
              >
                <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Item List */}
        <ScrollView style={styles.scrollArea} contentContainerStyle={{ paddingBottom: 60 }}>
          <View style={styles.list}>
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.topRow}>
                    <View style={[styles.typePill, { backgroundColor: item.typeBg || 'rgba(16, 185, 129, 0.12)' }]}>
                      <Text style={[styles.typeText, { color: item.typeColor || '#059669' }]}>
                        {item.type}
                      </Text>
                    </View>
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>

                  <Text style={styles.itemTitle}>{item.title}</Text>

                  <View style={styles.metaRow}>
                    <AlertCircle size={13} color={colors.textMuted} />
                    <Text style={styles.metaText}>{item.location}</Text>
                  </View>

                  <View style={styles.metaRow}>
                    <ShieldCheck size={13} color={colors.accent} />
                    <Text style={styles.deskText}>
                      Collection Desk: <Text style={{ fontWeight: '800', color: colors.text }}>{item.desk}</Text>
                    </Text>
                  </View>

                  {item.claimed && (
                    <View style={styles.claimedNoticeBox}>
                      <CheckCircle2 size={13} color="#059669" />
                      <Text style={styles.claimedNoticeText}>
                        Claimed by {item.claimedBy?.name || 'Verified User'} · Verification in progress
                      </Text>
                    </View>
                  )}

                  <View style={styles.bottomRow}>
                    <TouchableOpacity
                      style={[styles.claimBtn, item.claimed && styles.claimBtnPending]}
                      onPress={() => handleOpenClaim(item)}
                      activeOpacity={0.8}
                    >
                      <Compass size={14} color={item.claimed ? colors.primaryDark : colors.text} />
                      <Text style={[styles.claimBtnText, item.claimed && { color: colors.primaryDark }]}>
                        {item.claimed ? 'Claim Status / Route ↗' : 'Claim & Navigate to Desk'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.detailsBtn}
                      onPress={() => handleOpenClaim(item)}
                    >
                      <Text style={styles.detailsBtnText}>Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <AlertCircle size={32} color={colors.textMuted} />
                <Text style={styles.emptyTitle}>No matching items found</Text>
                <Text style={styles.emptySubtitle}>Try adjusting your search terms or filter selection.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {/* ADMIN ADD ITEM MODAL */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <View style={styles.adminBadgeRow}>
                  <Lock size={12} color={colors.primaryDark} />
                  <Text style={styles.adminBadgeText}>CAMPUS CUSTODY REGISTRY</Text>
                </View>
                <Text style={styles.modalTitle}>Log Displaced Item</Text>
                <Text style={styles.modalSubtitle}>Admin security protocol for found property</Text>
              </View>
              <TouchableOpacity 
                style={styles.modalCloseBtn}
                onPress={() => setShowAddModal(false)}
              >
                <X size={18} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalFormBody}>
              <Text style={styles.inputLabel}>Item Name / Description *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Wireless Noise Cancelling Headphones"
                placeholderTextColor={colors.textMuted}
                value={addForm.title}
                onChangeText={(t) => setAddForm({ ...addForm, title: t })}
              />

              <Text style={styles.inputLabel}>Registry Classification</Text>
              <View style={styles.presetDestRow}>
                {['FOUND', 'DEPOSITED', 'REPORTED LOST'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.presetDestChip,
                      addForm.type === type && styles.presetDestChipActive
                    ]}
                    onPress={() => setAddForm({ ...addForm, type })}
                  >
                    <Text style={[
                      styles.presetDestChipText,
                      addForm.type === type && styles.presetDestChipTextActive
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Spotted Location</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Central Library 1st Floor Discussion Room"
                placeholderTextColor={colors.textMuted}
                value={addForm.location}
                onChangeText={(t) => setAddForm({ ...addForm, location: t })}
              />

              <Text style={styles.inputLabel}>Custody Holding Desk</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Library Help Desk or Main Gate Security"
                placeholderTextColor={colors.textMuted}
                value={addForm.desk}
                onChangeText={(t) => setAddForm({ ...addForm, desk: t })}
              />

              <Text style={styles.inputLabel}>Navigation Junction Landmark</Text>
              <View style={styles.presetDestRow}>
                {['library', 'as-block', 'main-gate', 'sports-ground'].map((code) => (
                  <TouchableOpacity
                    key={code}
                    style={[
                      styles.presetDestChip,
                      addForm.destCode === code && styles.presetDestChipActive
                    ]}
                    onPress={() => setAddForm({ ...addForm, destCode: code })}
                  >
                    <Text style={[
                      styles.presetDestChipText,
                      addForm.destCode === code && styles.presetDestChipTextActive
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
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSubmitBtn}
                onPress={handleCreate}
              >
                <Plus size={15} color={colors.primaryForeground} strokeWidth={2.4} />
                <Text style={styles.modalSubmitText}>Register Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* USER CLAIM MODAL */}
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
                <Text style={styles.modalSubtitle}>Submit proof & navigate to collection desk</Text>
              </View>
              <TouchableOpacity 
                style={styles.modalCloseBtn}
                onPress={() => setShowClaimModal(false)}
              >
                <X size={18} color={colors.text} />
              </TouchableOpacity>
            </View>

            {selectedItem && (
              <View style={styles.itemSummaryBox}>
                <Text style={styles.summaryItemTitle}>{selectedItem.title}</Text>
                <Text style={styles.summaryItemLocation}>📍 Found: {selectedItem.location}</Text>
                <Text style={styles.summaryItemDesk}>🏛 Holding Desk: <Text style={{ fontWeight: '800' }}>{selectedItem.desk}</Text></Text>
              </View>
            )}

            <ScrollView style={styles.modalFormBody}>
              <Text style={styles.inputLabel}>Your Full Name *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Full Name"
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

              <Text style={styles.inputLabel}>Phone / Contact Number</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="+91 98765 43210"
                placeholderTextColor={colors.textMuted}
                value={claimForm.phone}
                onChangeText={(t) => setClaimForm({ ...claimForm, phone: t })}
              />

              <Text style={styles.inputLabel}>Verification Proof (Color, Brand, Marks, Serial)</Text>
              <TextInput
                style={[styles.modalInput, { height: 64, textAlignVertical: 'top' }]}
                placeholder="Describe markings, stickers, passcode, or color to prove ownership..."
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
    flex: 1,
    padding: 16,
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center'
  },
  topControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
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
  addBtn: {
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
  addBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryForeground,
    fontFamily: 'Outfit'
  },
  searchRow: {
    marginBottom: 16,
    gap: 10
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px -2px rgba(36, 32, 29, 0.04)'
      }
    })
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    padding: 0,
    fontFamily: 'Manrope',
    ...Platform.select({
      web: {
        outlineStyle: 'none'
      }
    })
  },
  filterChipsRow: {
    flexDirection: 'row',
    gap: 8
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  filterChipActive: {
    backgroundColor: colors.text,
    borderColor: colors.text
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    fontFamily: 'Outfit'
  },
  filterChipTextActive: {
    color: '#FFFFFF'
  },
  scrollArea: {
    flex: 1
  },
  list: {
    gap: 14
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px -2px rgba(36, 32, 29, 0.05)'
      }
    })
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  typePill: {
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 6
  },
  typeText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'Outfit',
    letterSpacing: 0.5
  },
  timeText: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: 'Manrope'
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Outfit',
    marginBottom: 8
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Manrope'
  },
  deskText: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'Manrope'
  },
  claimedNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 6
  },
  claimedNoticeText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '700',
    fontFamily: 'Manrope'
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    gap: 10
  },
  claimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.secondary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  claimBtnPending: {
    backgroundColor: 'rgba(234, 162, 40, 0.12)',
    borderColor: colors.primary
  },
  claimBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Manrope'
  },
  detailsBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10
  },
  detailsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
    fontFamily: 'Manrope'
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Outfit'
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'Manrope'
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
  claimBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3
  },
  claimBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
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
    gap: 6,
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
