import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Search, Layers, X, Navigation as NavIcon } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { HeaderBar } from '../components/common/HeaderBar';
import { CampusMap } from '../components/map/CampusMap';

const CATEGORIES = ['All', 'Academic', 'Research', 'Library', 'Dining', 'Sports', 'Auditorium'];

export const MapScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        title="Interactive Campus Map"
        subtitle="320 Road Network Nodes & GIS Calibrated"
        navigation={navigation}
      />

      <View style={styles.container}>
        {/* Search Bar & Category Filter Bar */}
        <View style={styles.topControls}>
          <View style={styles.searchBar}>
            <Search size={16} color={colors.primary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search buildings, facilities, landmarks..."
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
            contentContainerStyle={styles.categoriesRow}
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Full-Height Interactive Map Container */}
        <View style={styles.mapContainer}>
          <CampusMap
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            navigation={navigation}
          />
        </View>
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
  topControls: {
    marginBottom: 12,
    gap: 10
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    padding: 0,
    outlineWidth: 0
  },
  categoriesRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary
  },
  categoryTextActive: {
    color: '#24201D',
    fontWeight: '800'
  },
  mapContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder
  }
});
