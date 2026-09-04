import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Calendar from 'expo-calendar';
import { THEME } from '../constants/theme';
import { AstroEvent } from '../types';
import { StorageService } from '../services/storage';
import { SupabaseService, supabase } from '../services/supabase';

export default function EventDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ eventJson: string }>();

  const event: AstroEvent = params.eventJson
    ? JSON.parse(params.eventJson)
    : null;

  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isObserved, setIsObserved] = useState<boolean>(false);
  const [calendarLoading, setCalendarLoading] = useState<boolean>(false);

  useEffect(() => {
    if (event) {
      Promise.all([
        StorageService.isFavorite(event.id),
        StorageService.isObserved(event.id),
      ]).then(([fav, obs]) => {
        setIsFavorite(fav);
        setIsObserved(obs);
      });
    }
  }, [event]);

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Evento non trovato</Text>
      </View>
    );
  }

  const handleToggleFavorite = async () => {
    const newState = await StorageService.toggleFavorite(event.id);
    setIsFavorite(newState);

    const user = (await supabase.auth.getUser()).data.user;
    if (user) {
      await SupabaseService.syncUserEventState(
        user.id,
        event.id,
        newState,
        isObserved
      );
    }
  };

  const handleToggleObserved = async () => {
    const newState = await StorageService.toggleObserved(event.id);
    setIsObserved(newState);

    const user = (await supabase.auth.getUser()).data.user;
    if (user) {
      await SupabaseService.syncUserEventState(
        user.id,
        event.id,
        isFavorite,
        newState
      );
    }

    if (newState) {
      Alert.alert(
        'Congratulazioni! 🌟',
        'Hai aggiunto questo evento al tuo Passaporto di osservazioni celesti!'
      );
    }
  };

  const handleAddToCalendar = async () => {
    try {
      setCalendarLoading(true);
      const { status } = await Calendar.requestCalendarPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permesso Negato',
          'È necessario consentire l\'accesso al calendario per creare un promemoria.'
        );
        return;
      }

      // Trova un calendario scrivibile
      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      const defaultCalendar =
        Platform.OS === 'ios'
          ? calendars.find((cal) => cal.source && cal.source.name === 'Default') || calendars[0]
          : calendars.find((cal) => cal.isPrimary) || calendars[0];

      if (!defaultCalendar) {
        Alert.alert('Errore', 'Nessun calendario configurato sul dispositivo.');
        return;
      }

      const startDate = new Date(event.event_date);
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 ore dopo

      await Calendar.createEventAsync(defaultCalendar.id, {
        title: `🔭 Stellaris: ${event.title}`,
        startDate,
        endDate,
        location: `Punta lo sguardo verso ${event.direction}`,
        notes: `${event.description_tips}\n\nStrumento consigliato: ${event.instrument}`,
        alarms: [{ relativeOffset: -60 }], // 1 ora prima
      });

      Alert.alert(
        'Promemoria Aggiunto! 📅',
        `L'evento è stato salvato nel tuo calendario per il ${startDate.toLocaleDateString(
          'it-IT'
        )} alle ore ${startDate.toLocaleTimeString('it-IT', {
          hour: '2-digit',
          minute: '2-digit',
        })}. Riceverai una notifica 1 ora prima del picco.`
      );
    } catch (err) {
      console.error('Errore aggiunta evento al calendario:', err);
      Alert.alert(
        'Attenzione',
        'Non è stato possibile aggiungere l\'evento al calendario.'
      );
    } finally {
      setCalendarLoading(false);
    }
  };

  const formattedDate = new Date(event.event_date).toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = new Date(event.event_date).toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: event.title,
          headerBackTitle: 'Eventi',
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Copertina Full-Width */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: event.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.imageBadge}>
            <Text style={styles.imageBadgeText}>{event.category}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{event.title}</Text>

          {/* Dati Tecnici Chiave */}
          <View style={styles.techCard}>
            <View style={styles.techRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="time-outline" size={20} color={THEME.colors.accent} />
              </View>
              <View style={styles.techInfo}>
                <Text style={styles.techLabel}>Data e Ora del Picco</Text>
                <Text style={styles.techValue}>
                  {formattedDate} • ore {formattedTime}
                </Text>
              </View>
            </View>

            <View style={styles.techRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="compass-outline" size={20} color={THEME.colors.gold} />
              </View>
              <View style={styles.techInfo}>
                <Text style={styles.techLabel}>Direzione nel Cielo</Text>
                <Text style={styles.techValue}>{event.direction}</Text>
              </View>
            </View>

            <View style={styles.techRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="telescope-outline" size={20} color={THEME.colors.success} />
              </View>
              <View style={styles.techInfo}>
                <Text style={styles.techLabel}>Strumento Consigliato</Text>
                <Text style={styles.techValue}>{event.instrument}</Text>
              </View>
            </View>
          </View>

          {/* Consigli Pratici per l'Osservazione */}
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Ionicons name="sparkles" size={18} color={THEME.colors.gold} />
              <Text style={styles.tipsTitle}>Guida e Consigli per l'Osservazione</Text>
            </View>
            <Text style={styles.tipsText}>{event.description_tips}</Text>
          </View>

          {/* PULSANTI DI AZIONE */}
          <View style={styles.actionsContainer}>
            {/* Salva nei Preferiti */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.actionButton,
                isFavorite && styles.favoriteActiveButton,
              ]}
              onPress={handleToggleFavorite}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? '#FFFFFF' : THEME.colors.accent}
              />
              <Text
                style={[
                  styles.actionButtonText,
                  isFavorite && styles.actionButtonTextActive,
                ]}
              >
                {isFavorite ? 'Salvato nei Preferiti ❤️' : 'Salva nei Preferiti ❤️'}
              </Text>
            </TouchableOpacity>

            {/* L'ho visto! (Badge Osservato) */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.actionButton,
                isObserved && styles.observedActiveButton,
              ]}
              onPress={handleToggleObserved}
            >
              <Ionicons
                name={isObserved ? 'star' : 'star-outline'}
                size={20}
                color={isObserved ? '#FFFFFF' : THEME.colors.gold}
              />
              <Text
                style={[
                  styles.actionButtonText,
                  isObserved && styles.actionButtonTextActive,
                ]}
              >
                {isObserved ? 'Osservato nel Passaporto! 🌟' : 'L\'ho visto! 🌟'}
              </Text>
            </TouchableOpacity>

            {/* Aggiungi al Calendario di Sistema */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.calendarButton}
              onPress={handleAddToCalendar}
              disabled={calendarLoading}
            >
              <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
              <Text style={styles.calendarButtonText}>
                {calendarLoading ? 'Salvataggio...' : 'Aggiungi al Calendario 📅'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  imageContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(11, 13, 23, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  imageBadgeText: {
    color: THEME.colors.accent,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  body: {
    padding: THEME.spacing.md,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: 16,
  },
  techCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  techRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E2333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  techInfo: {
    flex: 1,
  },
  techLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    marginBottom: 2,
  },
  techValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  tipsCard: {
    backgroundColor: 'rgba(255, 183, 3, 0.06)',
    borderRadius: THEME.borderRadius.lg,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 183, 3, 0.25)',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipsTitle: {
    color: THEME.colors.gold,
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  tipsText: {
    color: '#E0E0E0',
    fontSize: 14,
    lineHeight: 22,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  favoriteActiveButton: {
    backgroundColor: THEME.colors.accent,
    borderColor: THEME.colors.accent,
  },
  observedActiveButton: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 10,
  },
  actionButtonTextActive: {
    color: '#FFFFFF',
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D3557',
    borderRadius: THEME.borderRadius.md,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#457B9D',
  },
  calendarButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 10,
  },
});
