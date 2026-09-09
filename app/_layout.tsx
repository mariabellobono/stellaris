import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, ThemeProvider, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { THEME } from '../constants/theme';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

const StellarisDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: THEME.colors.accent,
    background: THEME.colors.background,
    card: THEME.colors.surface,
    text: THEME.colors.text,
    border: THEME.colors.surfaceBorder,
  },
};

import { useAppUpdates } from '../hooks/useAppUpdates';
import { UpdateOverlay } from '../components/UpdateOverlay';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const { isUpdating, updateStatus } = useAppUpdates();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={StellarisDarkTheme}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: THEME.colors.background },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: THEME.colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="event-detail"
          options={{
            title: 'Dettaglio Evento',
            headerBackTitle: 'Indietro',
          }}
        />
        <Stack.Screen
          name="iss-compass"
          options={{
            title: 'Bussola ISS',
            headerShown: false,
          }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>

      {/* Modal / Schermata a schermo intero durante l'aggiornamento automatico */}
      <UpdateOverlay visible={isUpdating} statusText={updateStatus} />
    </ThemeProvider>
  );
}
