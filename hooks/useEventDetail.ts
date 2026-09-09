import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as Calendar from 'expo-calendar/legacy';
import { AstroEvent } from '../types';
import { StorageService } from '../services/storage';
import { SupabaseService, supabase } from '../services/supabase';

export function useEventDetail() {
  const params = useLocalSearchParams<{ eventJson: string }>();

  let parsedEvent: AstroEvent | null = null;
  try {
    if (params.eventJson) {
      parsedEvent = JSON.parse(params.eventJson);
    }
  } catch (err) {
    console.warn('Errore parsing parametri evento:', err);
  }

  const [event] = useState<AstroEvent | null>(parsedEvent);
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

  const handleToggleFavorite = async () => {
    if (!event) return;
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
    if (!event) return;
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
      // Sblocco automatico carta Astro-Dex collegata
      const cardIdToUnlock =
        event.dex_card_id ||
        (event.id.includes('perseidi') || event.title.toLowerCase().includes('perseidi')
          ? 'card_perseidi'
          : event.id.includes('iss') || event.title.toLowerCase().includes('iss')
          ? 'card_iss_pass'
          : event.id.includes('geminidi') || event.title.toLowerCase().includes('geminidi')
          ? 'card_geminidi'
          : event.title.toLowerCase().includes('luna') || event.title.toLowerCase().includes('superluna')
          ? 'card_supermoon'
          : event.title.toLowerCase().includes('pleiadi')
          ? 'card_pleiadi'
          : event.title.toLowerCase().includes('eclissi')
          ? 'card_solar_eclipse'
          : null);

      if (cardIdToUnlock) {
        await SupabaseService.unlockCard(user ? user.id : null, cardIdToUnlock);
      }

      Alert.alert(
        'Congratulazioni! 🌟',
        cardIdToUnlock
          ? 'Hai aggiunto questo evento al Passaporto e hai sbloccato una nuova carta nell\'Astro-Dex!'
          : 'Hai aggiunto questo evento al tuo Passaporto di osservazioni celesti!'
      );
    }
  };

  const handleAddToCalendar = async () => {
    if (!event) return;
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

  const formattedDate = event
    ? new Date(event.event_date).toLocaleDateString('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const formattedTime = event
    ? new Date(event.event_date).toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const imageUri =
    !event || !event.image_url || event.image_url.includes('1509198397868-475647b2a1e5')
      ? 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
      : event.image_url;

  return {
    event,
    isFavorite,
    isObserved,
    calendarLoading,
    formattedDate,
    formattedTime,
    imageUri,
    handleToggleFavorite,
    handleToggleObserved,
    handleAddToCalendar,
  };
}
