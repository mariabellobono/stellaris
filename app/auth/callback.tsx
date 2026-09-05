import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from '../../services/supabase';
import { THEME } from '../../constants/theme';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    code?: string;
    access_token?: string;
    refresh_token?: string;
    error?: string;
    error_description?: string;
  }>();

  useEffect(() => {
    let isMounted = true;

    async function handleAuthCallback() {
      try {
        WebBrowser.dismissAuthSession();
      } catch {}

      try {
        if (params.access_token && params.refresh_token) {
          await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });
        } else if (params.code) {
          await supabase.auth.exchangeCodeForSession(params.code);
        } else {
          const initialUrl = await Linking.getInitialURL();
          if (initialUrl) {
            const queryString = initialUrl.split('#')[0]?.split('?')[1] || '';
            const hashString = initialUrl.split('#')[1] || '';
            const parsed: Record<string, string> = {};

            const parseSection = (str: string) => {
              if (!str) return;
              str.split('&').forEach((p) => {
                const [k, v] = p.split('=');
                if (k && v) parsed[decodeURIComponent(k)] = decodeURIComponent(v);
              });
            };

            parseSection(queryString);
            parseSection(hashString);

            if (parsed.access_token && parsed.refresh_token) {
              await supabase.auth.setSession({
                access_token: parsed.access_token,
                refresh_token: parsed.refresh_token,
              });
            } else if (parsed.code) {
              await supabase.auth.exchangeCodeForSession(parsed.code);
            }
          }
        }
      } catch (err) {
        console.warn('Errore gestione callback Supabase:', err);
      } finally {
        if (isMounted) {
          router.replace('/(tabs)/profile');
        }
      }
    }

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [params, router]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: THEME.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator size="large" color={THEME.colors.accent} />
      <Text style={{ color: THEME.colors.textMuted, marginTop: 16 }}>
        Accesso in corso...
      </Text>
    </View>
  );
}

