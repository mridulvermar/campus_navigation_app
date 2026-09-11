import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { User, Mail, Shield, Building, Phone, LogOut, Settings, Award, QrCode } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { HeaderBar } from '../components/common/HeaderBar';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';

export const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        title="Student / Faculty Identity"
        subtitle="Verified Campus Credentials & Profile"
        navigation={navigation}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <GlassCard style={styles.profileCard} glow>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name || 'Mridul Verma'}</Text>
          <Text style={styles.email}>{user?.email || 'admin@campus.edu'}</Text>
          <View style={{ marginTop: 8 }}>
            <Badge variant="primary" size="md">{user?.role || 'Administrator'}</Badge>
          </View>
        </GlassCard>

        {/* Institutional Details */}
        <GlassCard style={styles.infoCard}>
          <Text style={styles.cardHeading}>Academic Affiliation</Text>
          
          <View style={styles.infoRow}>
            <Building size={16} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Department</Text>
              <Text style={styles.infoVal}>{user?.department || 'Computer Science & Engineering'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Shield size={16} color={colors.secondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Role Clearance</Text>
              <Text style={styles.infoVal}>{user?.role || 'Administrator'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Phone size={16} color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Contact Phone</Text>
              <Text style={styles.infoVal}>{user?.phone || '+91 (555) 019-2834'}</Text>
            </View>
          </View>
        </GlassCard>

        {/* Profile Quick Links */}
        <View style={styles.quickLinks}>
          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => navigation.navigate('Settings')}
          >
            <Settings size={18} color={colors.textSecondary} />
            <Text style={styles.linkText}>System Preferences & GIS Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.linkBtn, { borderColor: 'rgba(239, 68, 68, 0.4)' }]}
            onPress={handleLogout}
          >
            <LogOut size={18} color={colors.danger} />
            <Text style={[styles.linkText, { color: colors.danger }]}>Sign Out</Text>
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
    padding: 16,
    paddingBottom: 40
  },
  profileCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  avatarLarge: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#28231D',
    fontFamily: 'Sora'
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Sora'
  },
  email: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: 'Manrope'
  },
  infoCard: {
    padding: 18,
    marginBottom: 16,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  cardHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    fontFamily: 'Sora'
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '700'
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2
  },
  quickLinks: {
    gap: 10
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 14,
    padding: 14
  },
  linkText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text
  }
});
