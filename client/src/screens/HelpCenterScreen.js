import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Linking, Alert, Platform } from 'react-native';
import { HelpCircle, PhoneCall, Mail, MessageSquare, Compass, Shield, Sparkles } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { HeaderBar } from '../components/common/HeaderBar';
import { GlassCard } from '../components/common/GlassCard';

const FAQS = [
  { q: 'How does the turn-by-turn road navigation work?', a: 'Our Dijkstra routing engine calculates paths using a calibrated graph of 320 real campus road junctions, guaranteeing routes adhere to established pathways rather than cutting through building walls.' },
  { q: 'How do I locate my classroom?', a: 'Use the GIS Navigator search bar on the Map screen. All 428 classrooms across all campus blocks are indexed with exact building, floor, and room codes.' },
  { q: 'How does classroom and lab booking work?', a: 'Select any available lecture hall or computer lab in the Facility Hub, choose your time slot, and an instant digital pass with a verifiable QR code will be generated.' }
];

export const HelpCenterScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        title="Campus Help & Support"
        subtitle="FAQs, User Guides & Emergency Contact Desks"
        navigation={navigation}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Help Center Quick Action Contacts */}
        <View style={styles.contactsGrid}>
          <GlassCard style={styles.contactCard} glow>
            <Shield size={20} color={colors.danger} />
            <Text style={styles.contactTitle}>Emergency Desk</Text>
            <Text style={styles.contactValue}>Ext: 6000 / 6111</Text>
          </GlassCard>

          <GlassCard style={styles.contactCard}>
            <Compass size={20} color={colors.primary} />
            <Text style={styles.contactTitle}>GIS Admin Desk</Text>
            <Text style={styles.contactValue}>gis@campus.edu</Text>
          </GlassCard>
        </View>

        {/* AI Assistant Instant RAG Resolution Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Chatbot')}
          style={styles.aiChatCardWrap}
        >
          <GlassCard style={styles.aiChatCard} glow>
            <View style={styles.aiIconBadge}>
              <Sparkles size={20} color={colors.primary} />
            </View>
            <View style={styles.aiTextCol}>
              <Text style={styles.aiCardTitle}>Ask Campus AI Assistant</Text>
              <Text style={styles.aiCardDesc}>
                Instant answers on 25 campus buildings, 428 rooms, high-value asset checkout, and booking rules.
              </Text>
            </View>
            <View style={styles.chatNowBadge}>
              <Text style={styles.chatNowText}>Chat Now ↗</Text>
            </View>
          </GlassCard>
        </TouchableOpacity>

        {/* FAQs */}
        <Text style={styles.faqHeading}>Frequently Asked Questions</Text>

        <View style={styles.faqsList}>
          {FAQS.map((faq, idx) => (
            <GlassCard key={idx} style={styles.faqCard}>
              <Text style={styles.question}>{faq.q}</Text>
              <Text style={styles.answer}>{faq.a}</Text>
            </GlassCard>
          ))}
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
  contactsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16
  },
  contactCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  contactTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Sora'
  },
  contactValue: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Manrope'
  },
  faqHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    fontFamily: 'Sora'
  },
  faqsList: {
    gap: 10
  },
  faqCard: {
    padding: 16,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  question: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
    fontFamily: 'Sora'
  },
  answer: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    fontFamily: 'Manrope'
  },
  aiChatCardWrap: {
    marginBottom: 18
  },
  aiChatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  aiIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  aiTextCol: {
    flex: 1
  },
  aiCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 2,
    fontFamily: 'Sora'
  },
  aiCardDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16
  },
  chatNowBadge: {
    backgroundColor: colors.cardBgLight,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  chatNowText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.text
  }
});
