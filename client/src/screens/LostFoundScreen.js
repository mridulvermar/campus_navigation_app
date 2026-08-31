import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Search, Plus, MapPin, Tag, CheckCircle } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { HeaderBar } from '../components/common/HeaderBar';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';

const INITIAL_ITEMS = [
  { id: '1', title: 'Calculus Textbook & Notes', location: 'IB Block Floor 2, Room IB-204', category: 'Books', status: 'Found', date: 'Today, 11:30 AM' },
  { id: '2', title: 'Wireless Noise Cancelling Earbuds', location: 'Central Library Discussion Room', category: 'Electronics', status: 'Lost', date: 'Yesterday, 04:15 PM' },
  { id: '3', title: 'Smart ID Card & Lanyard', location: 'Student Dining Hall Counter 2', category: 'ID Cards', status: 'Found', date: 'Aug 26, 01:20 PM' }
];

export const LostFoundScreen = ({ navigation }) => {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [search, setSearch] = useState('');

  const filtered = items.filter((i) => 
    i.title.toLowerCase().includes(search.toLowerCase()) || 
    i.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        title="Lost & Found Desk"
        subtitle="Report or Locate Displaced Items Across Campus"
        navigation={navigation}
      />

      <View style={styles.container}>
        <View style={styles.searchBar}>
          <Search size={16} color={colors.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items, locations..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView style={styles.scrollArea} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={styles.list}>
            {filtered.map((item) => (
              <GlassCard key={item.id} style={styles.card} glow>
                <View style={styles.topRow}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Badge variant={item.status === 'Found' ? 'success' : 'warning'} size="sm">
                    {item.status}
                  </Badge>
                </View>

                <View style={styles.metaRow}>
                  <MapPin size={12} color={colors.primary} />
                  <Text style={styles.metaText}>{item.location}</Text>
                </View>

                <View style={styles.bottomRow}>
                  <Text style={styles.dateText}>{item.date}</Text>
                  <TouchableOpacity
                    style={styles.claimBtn}
                    onPress={() => Alert.alert('Claim Request', 'Contact Campus Security Desk with verification proof.')}
                  >
                    <Text style={styles.claimBtnText}>Claim Item</Text>
                  </TouchableOpacity>
                </View>
              </GlassCard>
            ))}
          </View>
        </ScrollView>
      </View>
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
    padding: 16
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    marginBottom: 12
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 12,
    padding: 0
  },
  scrollArea: {
    flex: 1
  },
  list: {
    gap: 10
  },
  card: {
    padding: 14
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    flex: 1,
    marginRight: 8
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 4
  },
  metaText: {
    fontSize: 11,
    color: colors.textSecondary
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.4)',
    paddingTop: 8
  },
  dateText: {
    fontSize: 10,
    color: colors.textMuted
  },
  claimBtn: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  claimBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.white
  }
});
