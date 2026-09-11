import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Package, Search, Tag, CheckCircle2, AlertTriangle, ShieldCheck, MapPin, X } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { HeaderBar } from '../components/common/HeaderBar';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { apiService } from '../services/api';
import { MOCK_ASSETS } from '../data/mockData';

const ASSET_CATEGORIES = ['All', 'Computing', 'AudioVisual', 'Laboratory', 'Networking'];

export const AssetsScreen = ({ navigation }) => {
  const [assets, setAssets] = useState(MOCK_ASSETS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const res = await apiService.getAssets();
        if (res?.data) setAssets(res.data);
      } catch (e) {}
    };
    loadAssets();
  }, []);

  const filteredAssets = assets.filter((a) => {
    const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      (a.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (a.serialNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.room?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        title="Asset Tracking Hub"
        subtitle="Live RFID, IoT & Smart Resource Inventory"
        navigation={navigation}
      />

      <View style={styles.container}>
        {/* Search & Category Filter */}
        <View style={styles.searchBar}>
          <Search size={16} color={colors.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search assets, RFID tags, serials, rooms..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          {ASSET_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catPill, selectedCategory === cat && styles.catPillActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.catText, selectedCategory === cat && styles.catTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Asset Cards List */}
        <ScrollView style={styles.scrollArea} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={styles.assetList}>
            {filteredAssets.map((asset) => (
              <GlassCard key={asset._id} style={styles.assetCard} glow>
                <View style={styles.cardTop}>
                  <View>
                    <Text style={styles.serialTag}>SN: {asset.serialNumber || 'N/A'}</Text>
                    <Text style={styles.assetName}>{asset.name}</Text>
                  </View>
                  <Badge variant={asset.status === 'Available' ? 'success' : 'warning'} size="sm">
                    {asset.status || 'Active'}
                  </Badge>
                </View>

                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <MapPin size={12} color={colors.primary} />
                    <Text style={styles.detailText}>{asset.room?.name || 'Central Tech Lab'}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Tag size={12} color={colors.secondary} />
                    <Text style={styles.detailText}>{asset.category}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.healthScore}>Health: 98% Optimal</Text>
                  <TouchableOpacity
                    style={styles.locateBtn}
                    onPress={() => navigation.navigate('Navigation', { destCode: asset.room?.roomNumber || asset.room?.name })}
                  >
                    <MapPin size={12} color="#070B14" />
                    <Text style={styles.locateBtnText}>Locate</Text>
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
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 12,
    padding: 0,
    outlineWidth: 0
  },
  catScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 10
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  catPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  catText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary
  },
  catTextActive: {
    color: '#24201D',
    fontWeight: '800'
  },
  scrollArea: {
    flex: 1
  },
  assetList: {
    gap: 10
  },
  assetCard: {
    padding: 16,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  serialTag: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5
  },
  assetName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
    fontFamily: 'Sora'
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 14,
    marginVertical: 10
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  detailText: {
    fontSize: 12,
    color: colors.textSecondary
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingTop: 10,
    marginTop: 6
  },
  healthScore: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '700'
  },
  locateBtn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  locateBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#24201D'
  }
});
