import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AstroEvent, UserEventState } from '../types';
import { StorageService } from './storage';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

import { fetchNasaAsteroids, fetchLiveMoonPhases } from './api/liveEvents';

export const isSupabaseConfigured = (): boolean => {
  return (
    !SUPABASE_URL.includes('your-project') &&
    !SUPABASE_ANON_KEY.includes('your-anon-key')
  );
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const SupabaseService = {
  async getEvents(): Promise<AstroEvent[]> {
    let dbEvents: AstroEvent[] = [];

    if (!isSupabaseConfigured()) {
      dbEvents = await StorageService.getCachedEvents();
    } else {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('event_date', { ascending: true });

        if (!error && data && data.length > 0) {
          dbEvents = data
            .filter(
              (item) =>
                !item.id?.startsWith('e100') &&
                !item.id?.startsWith('mock')
            )
            .map((item) => {
              let imageUrl = item.image_url;
              if (imageUrl && imageUrl.includes('1509198397868-475647b2a1e5')) {
                imageUrl =
                  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80';
              }
              return {
                id: item.id,
                title: item.title,
                category: item.category,
                event_date: item.event_date,
                instrument: item.instrument,
                direction: item.direction,
                description_tips: item.description_tips,
                image_url: imageUrl,
              };
            });
        } else if (error) {
          console.warn('Errore query Supabase, uso cache:', error);
          dbEvents = await StorageService.getCachedEvents();
        } else {
          // Tabella Supabase vuota: nessun evento statico da aggiungere
          dbEvents = [];
        }
      } catch (err) {
        console.warn('Connessione Supabase non riuscita, uso cache:', err);
        dbEvents = await StorageService.getCachedEvents();
      }
    }

    // Unisci in tempo reale gli eventi dinamici dall'API NASA JPL e Open-Meteo
    try {
      const [asteroids, moonEvents] = await Promise.all([
        fetchNasaAsteroids(),
        fetchLiveMoonPhases(),
      ]);

      const merged = [...dbEvents, ...moonEvents, ...asteroids];
      const uniqueEvents = Array.from(
        new Map(merged.map((ev) => [ev.id, ev])).values()
      ).filter(
        (ev) =>
          !ev.id.startsWith('e100') &&
          !ev.id.startsWith('mock') &&
          !ev.image_url?.includes('1509198397868-475647b2a1e5')
      );

      await StorageService.saveCachedEvents(uniqueEvents);
      return uniqueEvents;
    } catch (e) {
      console.warn('Errore fetch eventi live da NASA API:', e);
      return dbEvents.filter(
        (ev) =>
          !ev.id.startsWith('e100') &&
          !ev.id.startsWith('mock') &&
          !ev.image_url?.includes('1509198397868-475647b2a1e5')
      );
    }
  },

  async syncUserEventState(
    userId: string | null,
    eventId: string,
    isFavorite: boolean,
    isObserved: boolean
  ): Promise<void> {
    if (!userId || !isSupabaseConfigured()) {
      return;
    }

    try {
      const { error } = await supabase.from('user_events').upsert(
        {
          user_id: userId,
          event_id: eventId,
          is_favorite: isFavorite,
          is_observed: isObserved,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,event_id' }
      );

      if (error) {
        console.warn('Errore sync user_events con Supabase:', error);
      }
    } catch (err) {
      console.warn('Sync remoto non riuscito:', err);
    }
  },

  async getUserEvents(userId: string): Promise<UserEventState[]> {
    if (!userId || !isSupabaseConfigured()) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('user_events')
        .select('event_id, is_favorite, is_observed')
        .eq('user_id', userId);

      if (error || !data) return [];
      return data as UserEventState[];
    } catch {
      return [];
    }
  },
};
