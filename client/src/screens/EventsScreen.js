import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Calendar, MapPin, Users, Award, Clock } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { HeaderBar } from '../components/common/HeaderBar';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';

const EVENTS = [
  { id: '1', title: 'National Hackathon 2026', location: 'Main Auditorium & SF Computing Labs', date: 'Sep 05, 2026', time: '09:00 AM - 08:00 PM', category: 'Tech', attendees: 350 },
  { id: '2', title: 'AI & Robotics Symposium', location: 'IB Block Seminar Hall II', date: 'Sep 12, 2026', time: '10:30 AM - 04:30 PM', category: 'Academic', attendees: 180 },
  { id: '3', title: 'Inter-College Sports League', location: 'Campus Sports Complex', date: 'Sep 18, 2026', time: '07:00 AM - 06:00 PM', category: 'Sports', attendees: 500 }
];

export const EventsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        title="Campus Events & Highlights"
        subtitle="Conferences, Hackathons & Cultural Meets"
        navigation={navigation}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.list}>
          {EVENTS.map((evt) => (
            <GlassCard key={evt.id} style={styles.card} glow>
              <View style={styles.topRow}>
                <Text style={styles.title}>{evt.title}</Text>
                <Badge variant="purple" size="sm">{evt.category}</Badge>
              </View>

              <View style={styles.metaRow}>
                <Calendar size={12} color={colors.primary} />
                <Text style={styles.metaText}>{evt.date} • {evt.time}</Text>
              </View>

              <View style={styles.metaRow}>
                <MapPin size={12} color={colors.secondary} />
                <Text style={styles.metaText}>{evt.location}</Text>
              </View>

              <View style={styles.bottomRow}>
                <View style={styles.attendeesRow}>
                  <Users size={12} color={colors.accent} />
                  <Text style={styles.attendeesText}>{evt.attendees} Registered</Text>
                </View>

                <TouchableOpacity
                  style={styles.navBtn}
                  onPress={() => navigation.navigate('Navigation', { destCode: evt.location })}
                >
                  <MapPin size={12} color="#070B14" />
                  <Text style={styles.navBtnText}>Navigate to Venue</Text>
                </TouchableOpacity>
              </View>
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
  list: {
    gap: 12
  },
  card: {
    padding: 16
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    flex: 1,
    marginRight: 8
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 3
  },
  metaText: {
    fontSize: 11,
    color: colors.textSecondary
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.4)',
    paddingTop: 10
  },
  attendeesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  attendeesText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent
  },
  navBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  navBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#070B14'
  }
});
