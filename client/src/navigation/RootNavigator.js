import React from 'react';
import { View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { 
  Compass, 
  Building2, 
  CalendarDays, 
  Package, 
  UserRound 
} from 'lucide-react-native';

import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

// Screens
import { LandingScreen } from '../screens/LandingScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { MapScreen } from '../screens/MapScreen';
import { NavigationScreen } from '../screens/NavigationScreen';
import { BookingsScreen } from '../screens/BookingsScreen';
import { AssetsScreen } from '../screens/AssetsScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { LostFoundScreen } from '../screens/LostFoundScreen';
import { EventsScreen } from '../screens/EventsScreen';
import { HelpCenterScreen } from '../screens/HelpCenterScreen';
import { ChatbotScreen } from '../screens/ChatbotScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AdminScreen } from '../screens/AdminScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ Icon, focused }) {
  return (
    <View style={[
      styles.iconWrapper,
      focused && styles.iconWrapperActive
    ]}>
      <Icon 
        size={20} 
        color={focused ? '#24201D' : colors.textMuted} 
        strokeWidth={focused ? 2.5 : 2}
      />
    </View>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.cardBg,
          borderTopColor: colors.cardBorder,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 70,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 6
        },
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          fontFamily: 'Manrope',
          marginTop: 2
        }
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Campus',
          tabBarIcon: ({ focused }) => <TabIcon Icon={Building2} focused={focused} />
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: 'Navigate',
          tabBarIcon: ({ focused }) => <TabIcon Icon={Compass} focused={focused} />
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{
          tabBarLabel: 'Bookings',
          tabBarIcon: ({ focused }) => <TabIcon Icon={CalendarDays} focused={focused} />
        }}
      />
      <Tab.Screen
        name="Assets"
        component={AssetsScreen}
        options={{
          tabBarLabel: 'Assets',
          tabBarIcon: ({ focused }) => <TabIcon Icon={Package} focused={focused} />
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon Icon={UserRound} focused={focused} />
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    padding: 6,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    backgroundColor: colors.primary,
  }
});

export function RootNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background }
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Landing" component={LandingScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="Navigation" component={NavigationScreen} />
            <Stack.Screen name="Analytics" component={AnalyticsScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="LostFound" component={LostFoundScreen} />
            <Stack.Screen name="Events" component={EventsScreen} />
            <Stack.Screen name="Help" component={HelpCenterScreen} />
            <Stack.Screen name="Chatbot" component={ChatbotScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Admin" component={AdminScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
