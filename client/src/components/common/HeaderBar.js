import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { Bell, Navigation, ArrowLeft, Bot, ChevronDown } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';

export const HeaderBar = ({ title, subtitle, navigation, showBack }) => {
  const { user } = useAuth();

  const handleGoBack = () => {
    if (navigation) {
      if (navigation.canGoBack && navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('MainTabs', { screen: 'Dashboard' });
      }
    }
  };

  const isDashboard = !title || title === 'Dashboard';
  const shouldShowBack = showBack === true || (showBack === undefined && !isDashboard);

  const userInitial = user?.name ? user.name[0].toUpperCase() : 'A';
  const userName = user?.name?.split(' ')[0] || (user?.role === 'Administrator' ? 'Admin' : 'Student');

  return (
    <View style={styles.header}>
      <View style={styles.leftCol}>
        {shouldShowBack ? (
          <View style={styles.backRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={handleGoBack}
              activeOpacity={0.8}
            >
              <ArrowLeft size={16} color={colors.text} strokeWidth={2.4} />
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
            <View style={styles.screenTitleWrap}>
              <Text style={styles.screenTitle} numberOfLines={1}>{title}</Text>
              {subtitle ? <Text style={styles.screenSubtitle} numberOfLines={1}>{subtitle}</Text> : null}
            </View>
          </View>
        ) : (
          <View style={styles.brandingRow}>
            <View style={styles.brandIcon}>
              <Navigation size={18} color={colors.primaryForeground} strokeWidth={2.4} />
            </View>
            <View style={styles.brandTextWrap}>
              <Text style={styles.brandTitle}>CampusNav</Text>
              <Text style={styles.brandSubtitle}>BIT WAYFINDING</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.rightCol}>
        {/* Campus Assistant */}
        <TouchableOpacity
          style={styles.aiChatBtn}
          onPress={() => navigation?.navigate('Chatbot')}
          activeOpacity={0.8}
          accessibilityLabel="Campus AI Assistant"
        >
          <Bot size={17} color={colors.primaryDark} strokeWidth={2.2} />
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation?.navigate('Notifications')}
          activeOpacity={0.8}
          accessibilityLabel="Notifications"
        >
          <Bell size={17} color={colors.textSecondary} strokeWidth={2} />
          <View style={styles.dot} />
        </TouchableOpacity>

        {/* Profile Pill */}
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => navigation?.navigate('Profile')}
          activeOpacity={0.8}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{userInitial}</Text>
          </View>
          <Text style={styles.profileName} numberOfLines={1}>{userName}</Text>
          <ChevronDown size={11} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ANDROID_STATUS_BAR = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 0;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: ANDROID_STATUS_BAR + (Platform.OS === 'android' ? 8 : 12),
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    backgroundColor: colors.cardBg,
    zIndex: 100,
    ...Platform.select({
      web: {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 2
      }
    })
  },
  leftCol: {
    flex: 1,
    marginRight: 10
  },
  brandingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 4,
    elevation: 2
  },
  brandTextWrap: {
    justifyContent: 'center'
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.4,
    fontFamily: 'Outfit',
    lineHeight: 18
  },
  brandSubtitle: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
    fontFamily: 'Outfit',
    marginTop: 1
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  backBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Outfit'
  },
  screenTitleWrap: {
    flex: 1
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Outfit',
    letterSpacing: -0.3
  },
  screenSubtitle: {
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: 'Manrope'
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  aiChatBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.secondary,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  avatarCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarInitial: {
    color: colors.primaryForeground,
    fontWeight: '800',
    fontSize: 10,
    fontFamily: 'Outfit'
  },
  profileName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Manrope',
    maxWidth: 60
  }
});
