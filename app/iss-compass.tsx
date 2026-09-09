import React from 'react';
import { useRouter, Stack } from 'expo-router';
import { ISSCompassScreen } from '../components/ISSCompassScreen';

export default function ISSCompassRoute() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ISSCompassScreen onBack={() => router.back()} />
    </>
  );
}
