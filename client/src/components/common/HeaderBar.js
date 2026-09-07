import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bell, User, MapPin, ArrowLeft, Home, Sparkles } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';

export const HeaderBar = ({ title, subtitle, navigation, showBack = false }) => {
  const { user } = useAuth();

  const handleGoBack = () => {
    if (navigation) {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('MainTabs', { screen: 'Dashboard' });
      }
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftCol}>
        <View style={styles.brandingRow}>
          {showBack && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={handleGoBack}
              activeOpacity={0.8}
            >
              <ArrowLeft size={16} color={colors.primary} />
              <Text style={styles.backBtnText}>Back to Home</Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.logoBadge}>
            <MapPin size={14} color={colors.primary} />
          </View>
          <Text style={styles.campusTag}>BIT SATHY SPATIAL</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <View style={styles.rightCol}>
        <TouchableOpacity
          style={styles.aiChatBtn}
          onPress={() => navigation?.navigate('Chatbot')}
          title="Campus AI Assistant"
        >
          <Sparkles size={18} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeIconBtn}
          onPress={() => navigation?.navigate('MainTabs', { screen: 'Dashboard' })}
        >
          <Home size={18} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation?.navigate('Notifications')}
        >
          <Bell size={18} color={colors.textSecondary} />
          <View style={styles.dot} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => navigation?.navigate('Profile')}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.4)',
    backgroundColor: 'rgba(7, 11, 20, 0.95)',
    zIndex: 100
  },
  leftCol: {
    flex: 1
  },
  brandingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 4
  },
  backBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary
  },
  logoBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  campusTag: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1.2
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  aiChatBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(6, 182, 212, 0.18)',
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 3
  },
  homeIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.cardBgLight,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  dot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary
  },
  profileBtn: {
    marginLeft: 2
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: 'rgba(99, 102, 241, 0.5)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarInitial: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 14
  }
});
