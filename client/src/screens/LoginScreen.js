import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { 
  Mail, 
  Lock, 
  LogIn, 
  UserCheck, 
  Shield, 
  GraduationCap, 
  Navigation,
  ArrowRight,
  Sparkles,
  Compass
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('admin@campus.edu');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();

  const handleLogin = async (overrideEmail, overridePassword) => {
    const loginEmail = overrideEmail || email;
    const loginPass = overridePassword || password;

    if (!loginEmail || !loginPass) {
      setErrorMsg('Please enter your institutional email and password');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    const res = await login(loginEmail, loginPass);
    setLoading(false);
    if (res.success) {
      navigation.navigate('MainTabs');
    } else {
      setErrorMsg(res.message || 'Login failed. Please check credentials.');
    }
  };

  const setDemoRoleAndLogin = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('password123');
    handleLogin(roleEmail, 'password123');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* Top Brand Header */}
          <View style={styles.branding}>
            <View style={styles.logoBadge}>
              <Navigation size={26} color={colors.primaryForeground} strokeWidth={2.4} />
            </View>
            <View style={styles.brandTextWrap}>
              <Text style={styles.title}>CampusNav</Text>
              <View style={styles.brandTagPill}>
                <Text style={styles.brandTagText}>BIT WAYFINDING PLATFORM</Text>
              </View>
            </View>
            <Text style={styles.subtitle}>
              Turn-by-turn GIS navigation, event wayfinding, and facility reservation system for Bannari Amman Institute of Technology
            </Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.formTitle}>Welcome back</Text>
              <Text style={styles.formSubtitle}>Enter your institutional credentials to access your account</Text>
            </View>

            {/* Error Banner */}
            {errorMsg ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>
                  {errorMsg}
                </Text>
              </View>
            ) : null}

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Institutional Email</Text>
              <View style={styles.inputWrapper}>
                <Mail size={18} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="name@campus.edu"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity onPress={() => handleLogin('student@campus.edu', 'password123')}>
                  <Text style={styles.forgotPassText}>Use demo pass</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <Lock size={18} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••••••"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={() => handleLogin()}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Text style={styles.submitText}>
                {loading ? 'Authenticating...' : 'Sign in to CampusNav'}
              </Text>
              <ArrowRight size={18} color={colors.primaryForeground} />
            </TouchableOpacity>

            {/* Guest Access Button */}
            <TouchableOpacity
              style={styles.guestBtn}
              onPress={() => navigation.navigate('MainTabs')}
              activeOpacity={0.85}
            >
              <Compass size={16} color={colors.text} />
              <Text style={styles.guestBtnText}>Continue as Campus Visitor</Text>
            </TouchableOpacity>

            {/* Fast Demo Switcher */}
            <View style={styles.demoSection}>
              <View style={styles.demoHeaderRow}>
                <View style={styles.demoLine} />
                <Text style={styles.demoTitle}>QUICK ONE-TAP DEMO ACCESS</Text>
                <View style={styles.demoLine} />
              </View>

              <View style={styles.demoButtonsRow}>
                <TouchableOpacity
                  style={styles.demoBtn}
                  onPress={() => setDemoRoleAndLogin('admin@campus.edu')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.demoIconWrap, { backgroundColor: '#FEE2E2' }]}>
                    <Shield size={15} color={colors.danger} />
                  </View>
                  <Text style={styles.demoRole}>Admin</Text>
                  <Text style={styles.demoSub}>Full Control</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.demoBtn}
                  onPress={() => setDemoRoleAndLogin('faculty@campus.edu')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.demoIconWrap, { backgroundColor: '#ECFDF5' }]}>
                    <UserCheck size={15} color="#059669" />
                  </View>
                  <Text style={styles.demoRole}>Faculty</Text>
                  <Text style={styles.demoSub}>Staff Passes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.demoBtn}
                  onPress={() => setDemoRoleAndLogin('student@campus.edu')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.demoIconWrap, { backgroundColor: colors.secondary }]}>
                    <GraduationCap size={15} color={colors.primaryDark} />
                  </View>
                  <Text style={styles.demoRole}>Student</Text>
                  <Text style={styles.demoSub}>Campus User</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Link */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Need institutional account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Create account →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  container: {
    padding: 24,
    justifyContent: 'center',
    minHeight: '100%',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center'
  },
  branding: {
    alignItems: 'center',
    marginBottom: 26,
    textAlign: 'center'
  },
  logoBadge: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4
  },
  brandTextWrap: {
    alignItems: 'center',
    gap: 6
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    fontFamily: 'Outfit',
    letterSpacing: -0.8
  },
  brandTagPill: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  brandTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.secondaryForeground,
    letterSpacing: 0.8,
    fontFamily: 'Outfit'
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'Manrope',
    lineHeight: 19,
    maxWidth: 380
  },
  card: {
    padding: 28,
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...Platform.select({
      web: {
        boxShadow: '0 16px 36px -8px rgba(36, 32, 29, 0.08), 0 4px 12px -2px rgba(36, 32, 29, 0.03)'
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
        elevation: 3
      }
    })
  },
  cardHeader: {
    marginBottom: 20
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Outfit',
    letterSpacing: -0.4,
    marginBottom: 4
  },
  formSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Manrope'
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'Manrope'
  },
  inputGroup: {
    marginBottom: 16
  },
  passwordLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Manrope',
    marginBottom: 6
  },
  forgotPassText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
    fontFamily: 'Manrope'
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 14,
    height: 48
  },
  inputIcon: {
    marginRight: 10
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontFamily: 'Manrope',
    height: '100%',
    outlineStyle: 'none'
  },
  submitBtn: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
    marginBottom: 10,
    ...Platform.select({
      web: {
        boxShadow: '0 6px 20px -2px rgba(234, 162, 40, 0.42)'
      },
      default: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 3
      }
    })
  },
  submitText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryForeground,
    fontFamily: 'Outfit'
  },
  guestBtn: {
    backgroundColor: colors.cardBgLight,
    height: 44,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 20
  },
  guestBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Manrope'
  },
  demoSection: {
    marginBottom: 20
  },
  demoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14
  },
  demoLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.cardBorder
  },
  demoTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
    fontFamily: 'Outfit'
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 8
  },
  demoBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  demoIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  demoRole: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Outfit',
    marginBottom: 1
  },
  demoSub: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: 'Manrope'
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Manrope'
  },
  registerLink: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryDark,
    fontFamily: 'Outfit'
  }
});
