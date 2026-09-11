import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Bell, Navigation, ArrowLeft, Bot, Sparkles, ChevronDown } from 'lucide-react-native';
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

  const shouldShowBack = showBack === true || (showBack === undefined && title && title !== 'Dashboard');

  const userInitial = user?.name ? user.name[0].toUpperCase() : 'AS';
  const userName = user?.name?.split(' ')[0] || 'Alex';

  return (
    <View style={styles.header}>
      <View style={styles.leftCol}>
        <View style={styles.brandingRow}>
          {shouldShowBack && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={handleGoBack}
              activeOpacity={0.8}
            >
              <ArrowLeft size={15} color={colors.text} strokeWidth={2.4} />
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
          )}

          <View style={styles.brandIcon}>
            <Navigation size={18} color={colors.primaryForeground} />
          </View>
          <View>
            <Text style={styles.brandTitle}>CampusNav</Text>
            <Text style={styles.brandSubtitle}>BIT WAYFINDING</Text>
          </View>
        </View>

        {title ? (
          <View style={styles.titleBox}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        ) : (
          <View style={styles.subtextBlock}>
            <Text style={styles.campusName}>Bannari Amman Institute of Technology</Text>
            <Text style={styles.campusLocation}>Sathyamangalam campus</Text>
          </View>
        )}
      </View>

      <View style={styles.rightCol}>
        {/* Campus Assistant Link */}
        <TouchableOpacity
          style={styles.aiChatBtn}
          onPress={() => navigation?.navigate('Chatbot')}
          activeOpacity={0.8}
          title="Campus Assistant"
        >
          <Bot size={18} color={colors.primaryDark} />
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation?.navigate('Notifications')}
          activeOpacity={0.8}
        >
          <Bell size={18} color={colors.textSecondary} />
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
          <ChevronDown size={12} color={colors.textMuted} />
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
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    backgroundColor: colors.cardBg,
    zIndex: 100,
    ...Platform.select({
      web: {
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
      }
    })
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
    gap: 5,
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginRight: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        boxShadow: '0 2px 6px -1px rgba(36, 32, 29, 0.06)'
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1
      }
    })
  },
  backBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Outfit'
  },
  brandIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
    lineHeight: 16,
    fontFamily: 'Sora'
  },
  brandSubtitle: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
    fontFamily: 'Manrope'
  },
  titleBox: {
    marginTop: 2
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
    fontFamily: 'Sora'
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
    fontFamily: 'Manrope'
  },
  subtextBlock: {
    marginTop: 2
  },
  campusName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Sora'
  },
  campusLocation: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: 'Manrope'
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
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: 'rgba(234, 162, 40, 0.35)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  dot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  avatarCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarInitial: {
    color: colors.primaryForeground,
    fontWeight: '800',
    fontSize: 10,
    fontFamily: 'Sora'
  },
  profileName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Manrope'
  }
});
