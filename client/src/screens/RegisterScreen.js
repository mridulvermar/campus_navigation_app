import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Mail, Lock, User, UserPlus, Building, Phone, MapPin } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { GlassCard } from '../components/common/GlassCard';
import { useAuth } from '../context/AuthContext';

export const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [role, setRole] = useState('Student');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    setLoading(true);
    const res = await register({ name, email, department, role, password });
    setLoading(false);
    if (res.success) {
      navigation.navigate('MainTabs');
    } else {
      Alert.alert('Registration Failed', res.message || 'Error occurred');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.branding}>
            <View style={styles.logoBadge}>
              <MapPin size={24} color="#24201D" />
            </View>
            <Text style={styles.title}>CampusNav</Text>
            <Text style={styles.subtitle}>Create your BIT institutional account</Text>
          </View>

          <GlassCard style={styles.card} glow>
            <Text style={styles.formTitle}>Join CampusNav</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <User size={16} color={colors.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Aditi Sharma"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Campus Email</Text>
              <View style={styles.inputWrapper}>
                <Mail size={16} color={colors.textMuted} />
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Department</Text>
              <View style={styles.inputWrapper}>
                <Building size={16} color={colors.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder="Department / Branch"
                  placeholderTextColor={colors.textMuted}
                  value={department}
                  onChangeText={setDepartment}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Lock size={16} color={colors.textMuted} />
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

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              <UserPlus size={18} color="#24201D" />
              <Text style={styles.submitText}>
                {loading ? 'Creating...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign in</Text>
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
    minHeight: '100%',
    maxWidth: 460,
    width: '100%',
    alignSelf: 'center'
  },
  branding: {
    alignItems: 'center',
    marginBottom: 20
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: colors.text,
    fontFamily: 'Outfit',
    letterSpacing: -0.6
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
    fontFamily: 'Manrope',
    maxWidth: 360
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
  formTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 14,
    fontFamily: 'Outfit'
  },
  inputGroup: {
    marginBottom: 14
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Manrope',
    marginBottom: 6
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
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontFamily: 'Manrope',
    marginLeft: 8,
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
    marginTop: 10,
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
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Manrope'
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryDark,
    fontFamily: 'Outfit'
  }
});
