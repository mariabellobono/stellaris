import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTabScreenOptions } from '../../styles/tabs.styles';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 12) + 6;
  const tabHeight = 54 + bottomPadding;

  return (
    <Tabs screenOptions={getTabScreenOptions(bottomPadding, tabHeight)}>
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
          title: 'Eventi',
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
        name="astro-dex"
        options={{
          title: 'Astro-Dex',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'sparkles' : 'sparkles-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="light-pollution"
        options={{
          title: 'Mappa',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'map' : 'map-outline'}
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
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
