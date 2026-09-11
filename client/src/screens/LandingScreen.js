import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { 
  MapPin, 
  Navigation, 
  CalendarCheck, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  Users, 
  Sparkles,
  Search
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { GlassCard } from '../components/common/GlassCard';

export const LandingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Top Navbar */}
        <View style={styles.navBar}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Navigation size={16} color="#24201D" />
            </View>
            <Text style={styles.brandTitle}>CampusNav</Text>
          </View>
          <TouchableOpacity
            style={styles.signInBtn}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.pillBadge}>
            <Sparkles size={12} color={colors.primaryDark} />
            <Text style={styles.pillText}>Bannari Amman Institute of Technology</Text>
          </View>

          <Text style={styles.heroTitle}>
            Spatial Navigation & <Text style={{ color: colors.primaryDark }}>Smart Campus Hub</Text>
          </Text>

          <Text style={styles.heroDescription}>
            Instant turn-by-turn road Dijkstra routing across 320 junctions, 428 classrooms, live facility booking, RAG campus AI assistant, and digital QR passes.
          </Text>

          {/* Quick CTA Buttons */}
          <View style={styles.ctaRow}>
            <TouchableOpacity
              style={styles.primaryCta}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Map' })}
            >
              <Navigation size={16} color="#24201D" />
              <Text style={styles.primaryCtaText}>Explore Live Campus Map</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryCta}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Bookings' })}
            >
              <CalendarCheck size={16} color={colors.text} />
              <Text style={styles.secondaryCtaText}>Book Facilities</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Core Feature Highlights */}
        <Text style={styles.sectionHeading}>Campus Innovations</Text>

        <View style={styles.grid}>
          <GlassCard style={styles.featureCard} glow>
            <View style={[styles.cardIcon, { backgroundColor: '#FEF3C7' }]}>
              <Navigation size={22} color="#D97706" />
            </View>
            <Text style={styles.cardTitle}>Dual-Mode Dijkstra GIS</Text>
            <Text style={styles.cardDesc}>
              Follows realistic campus pathways and road networks for both pedestrians and campus vehicles.
            </Text>
          </GlassCard>

          <GlassCard style={styles.featureCard}>
            <View style={[styles.cardIcon, { backgroundColor: '#EEF2FF' }]}>
              <Search size={22} color="#4F46E5" />
            </View>
            <Text style={styles.cardTitle}>428 Classrooms Search</Text>
            <Text style={styles.cardDesc}>
              Locate any lecture hall, lab, or faculty room across all campus blocks with exact floor indicators.
            </Text>
          </GlassCard>

          <GlassCard style={styles.featureCard}>
            <View style={[styles.cardIcon, { backgroundColor: '#ECFDF5' }]}>
              <CalendarCheck size={22} color="#059669" />
            </View>
            <Text style={styles.cardTitle}>Smart Facility Reservation</Text>
            <Text style={styles.cardDesc}>
              Book computer labs, seminar halls, and project labs with instant QR digital access codes.
            </Text>
          </GlassCard>

          <GlassCard style={styles.featureCard}>
            <View style={[styles.cardIcon, { backgroundColor: '#FFFBEB' }]}>
              <ShieldCheck size={22} color="#B45309" />
            </View>
            <Text style={styles.cardTitle}>Live Emergency SOS</Text>
            <Text style={styles.cardDesc}>
              Instant 24/7 one-touch emergency response broadcasting your exact GPS coordinates to campus security.
            </Text>
          </GlassCard>
        </View>

        {/* Direct Access CTA */}
        <View style={styles.bannerCard}>
          <Text style={styles.bannerTitle}>Ready to navigate your campus?</Text>
          <Text style={styles.bannerSubtitle}>Access your student, faculty, or administrative portal seamlessly.</Text>
          <TouchableOpacity
            style={styles.bannerBtn}
            onPress={() => navigation.navigate('MainTabs')}
          >
            <Text style={styles.bannerBtnText}>Enter Campus Platform</Text>
            <ArrowRight size={16} color="#24201D" />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    padding: 20,
    paddingBottom: 40,
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center'
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Sora'
  },
  signInBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  signInText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Manrope'
  },
  heroSection: {
    marginBottom: 32
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.cardBgLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 16
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    fontFamily: 'Manrope'
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 42,
    letterSpacing: -0.8,
    marginBottom: 12,
    fontFamily: 'Sora'
  },
  heroDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
    fontFamily: 'Manrope'
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  primaryCta: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  primaryCtaText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#24201D'
  },
  secondaryCta: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  secondaryCtaText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
    fontFamily: 'Sora'
  },
  grid: {
    gap: 14,
    marginBottom: 24
  },
  featureCard: {
    padding: 18,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
    fontFamily: 'Sora'
  },
  cardDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    fontFamily: 'Manrope'
  },
  bannerCard: {
    padding: 24,
    backgroundColor: colors.cardBgLight,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    textAlign: 'center'
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
    textAlign: 'center',
    fontFamily: 'Sora'
  },
  bannerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 18,
    fontFamily: 'Manrope'
  },
  bannerBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  bannerBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#24201D'
  }
});
