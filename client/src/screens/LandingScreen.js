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
              <MapPin size={18} color={colors.primary} />
            </View>
            <Text style={styles.brandTitle}>CAMPUS GIS</Text>
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
            <Sparkles size={12} color={colors.primary} />
            <Text style={styles.pillText}>Next-Gen Smart Campus Platform</Text>
          </View>

          <Text style={styles.heroTitle}>
            Spatial Navigation & <Text style={{ color: colors.primary }}>Smart Resource Hub</Text>
          </Text>

          <Text style={styles.heroDescription}>
            Instant turn-by-turn road Dijkstra routing across 320 junctions, 428 classrooms, live facility booking, real-time spatial sync, and automated digital passes.
          </Text>

          {/* Quick CTA Buttons */}
          <View style={styles.ctaRow}>
            <TouchableOpacity
              style={styles.primaryCta}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Map' })}
            >
              <Navigation size={16} color="#070B14" />
              <Text style={styles.primaryCtaText}>Explore Live Campus Map</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryCta}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Bookings' })}
            >
              <CalendarCheck size={16} color={colors.primary} />
              <Text style={styles.secondaryCtaText}>Book Facilities</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Core Feature Highlights */}
        <Text style={styles.sectionHeading}>Campus Innovations</Text>

        <View style={styles.grid}>
          <GlassCard style={styles.featureCard} glow>
            <View style={[styles.cardIcon, { backgroundColor: 'rgba(6, 182, 212, 0.15)' }]}>
              <Navigation size={22} color={colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Dual-Mode Dijkstra GIS</Text>
            <Text style={styles.cardDesc}>
              Follows realistic campus pathways and road networks for both pedestrians and campus vehicles.
            </Text>
          </GlassCard>

          <GlassCard style={styles.featureCard}>
            <View style={[styles.cardIcon, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
              <Search size={22} color={colors.secondary} />
            </View>
            <Text style={styles.cardTitle}>428 Classrooms Search</Text>
            <Text style={styles.cardDesc}>
              Locate any lecture hall, lab, or faculty room across all campus blocks with exact floor indicators.
            </Text>
          </GlassCard>

          <GlassCard style={styles.featureCard}>
            <View style={[styles.cardIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <CalendarCheck size={22} color={colors.accent} />
            </View>
            <Text style={styles.cardTitle}>Smart Facility Reservation</Text>
            <Text style={styles.cardDesc}>
              Book computer labs, seminar halls, and project labs with instant QR digital access codes.
            </Text>
          </GlassCard>

          <GlassCard style={styles.featureCard}>
            <View style={[styles.cardIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <ShieldCheck size={22} color={colors.warning} />
            </View>
            <Text style={styles.cardTitle}>Live Emergency SOS</Text>
            <Text style={styles.cardDesc}>
              Instant 24/7 one-touch emergency response broadcasting your exact GPS coordinates to campus security.
            </Text>
          </GlassCard>
        </View>

        {/* Direct Access CTA */}
        <GlassCard style={styles.bannerCard} borderColor={colors.primaryGlow}>
          <Text style={styles.bannerTitle}>Ready to navigate your campus?</Text>
          <Text style={styles.bannerSubtitle}>Access your student, faculty, or administrative portal seamlessly.</Text>
          <TouchableOpacity
            style={styles.bannerBtn}
            onPress={() => navigation.navigate('MainTabs')}
          >
            <Text style={styles.bannerBtnText}>Enter Campus Platform</Text>
            <ArrowRight size={16} color="#070B14" />
          </TouchableOpacity>
        </GlassCard>
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
    paddingBottom: 40
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.4)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 1
  },
  signInBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.cardBgLight,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  signInText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary
  },
  heroSection: {
    marginBottom: 32
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    marginBottom: 16
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    lineHeight: 38,
    letterSpacing: -0.8,
    marginBottom: 12
  },
  heroDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  primaryCta: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 14px rgba(6, 182, 212, 0.4)'
      },
      default: {
        shadowColor: colors.primary,
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 4
      }
    })
  },
  primaryCtaText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#070B14'
  },
  secondaryCta: {
    backgroundColor: colors.cardBgLight,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
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
    marginBottom: 16
  },
  grid: {
    gap: 14,
    marginBottom: 24
  },
  featureCard: {
    padding: 16
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
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6
  },
  cardDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18
  },
  bannerCard: {
    padding: 20,
    backgroundColor: 'rgba(6, 182, 212, 0.08)',
    alignItems: 'center',
    textAlign: 'center'
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 6,
    textAlign: 'center'
  },
  bannerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16
  },
  bannerBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  bannerBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#070B14'
  }
});
