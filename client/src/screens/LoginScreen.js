import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Mail, Lock, LogIn, UserCheck, Shield, GraduationCap, MapPin } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { GlassCard } from '../components/common/GlassCard';
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
      setErrorMsg('Please enter your email and password');
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
        <ScrollView contentContainerStyle={styles.container}>
          {/* Logo Branding */}
          <View style={styles.branding}>
            <View style={styles.logoBadge}>
              <MapPin size={24} color={colors.primary} />
            </View>
            <Text style={styles.title}>BIT CAMPUS PORTAL</Text>
            <Text style={styles.subtitle}>Sign in to access GIS spatial navigation & booking</Text>
          </View>

          {/* Login Card */}
          <GlassCard style={styles.card} glow>
            <Text style={styles.formTitle}>Secure Sign In</Text>

            {/* Error Banner */}
            {errorMsg ? (
              <View style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderWidth: 1, borderColor: colors.danger, borderRadius: 10, padding: 10, marginBottom: 12 }}>
                <Text style={{ color: colors.danger, fontSize: 12, fontWeight: '700', textAlign: 'center' }}>
                  {errorMsg}
                </Text>
              </View>
            ) : null}

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Institutional Email</Text>
              <View style={styles.inputWrapper}>
                <Mail size={16} color={colors.primary} />
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
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Lock size={16} color={colors.primary} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
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
              activeOpacity={0.8}
            >
              <LogIn size={18} color="#070B14" />
              <Text style={styles.submitText}>
                {loading ? 'Authenticating...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Fast Demo Switcher */}
            <View style={styles.demoSection}>
              <Text style={styles.demoTitle}>1-CLICK QUICK ACCESS</Text>
              <View style={styles.demoButtonsRow}>
                <TouchableOpacity
                  style={styles.demoBtn}
                  onPress={() => setDemoRoleAndLogin('admin@campus.edu')}
                >
                  <Shield size={12} color={colors.danger} />
                  <Text style={styles.demoBtnText}>Admin</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.demoBtn}
                  onPress={() => setDemoRoleAndLogin('faculty@campus.edu')}
                >
                  <UserCheck size={12} color={colors.accent} />
                  <Text style={styles.demoBtnText}>Faculty</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.demoBtn}
                  onPress={() => setDemoRoleAndLogin('student@campus.edu')}
                >
                  <GraduationCap size={12} color={colors.primary} />
                  <Text style={styles.demoBtnText}>Student</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Link */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Register here</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
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
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%'
  },
  branding: {
    alignItems: 'center',
    marginBottom: 24
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 1
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center'
  },
  card: {
    padding: 20
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16
  },
  inputGroup: {
    marginBottom: 14
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    padding: 0
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8
  },
  submitText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#070B14'
  },
  demoSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.5)'
  },
  demoTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center'
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 8
  },
  demoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: colors.cardBgLight,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  demoBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary
  },
  registerLink: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary
  }
});
