import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME } from '../../constants/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 12) + 6;
  const tabHeight = 54 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: THEME.colors.accent,
        tabBarInactiveTintColor: THEME.colors.textMuted,
        tabBarStyle: {
          backgroundColor: THEME.colors.tabBar,
          borderTopColor: THEME.colors.tabBarBorder,
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: bottomPadding,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: THEME.colors.background,
          borderBottomColor: THEME.colors.tabBarBorder,
          borderBottomWidth: 1,
          shadowOpacity: 0,
          elevation: 0,
        },
        headerTintColor: THEME.colors.text,
        headerTitleStyle: {
          fontWeight: '800',
          letterSpacing: 0.5,
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'STELLARIS ✦',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'planet' : 'planet-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Esplora',
          headerTitle: 'Eventi Celesti',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'telescope' : 'telescope-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profilo',
          headerTitle: 'Area Personale',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'star' : 'star-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      {/* Nasconde la route predefinita 'two' se rimasta */}
      <Tabs.Screen
        name="two"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
