import { createClient } from '@supabase/supabase-js';
import { AstroEvent, UserEventState } from '../types';
import { StorageService } from './storage';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const isSupabaseConfigured = (): boolean => {
  return (
    !SUPABASE_URL.includes('your-project') &&
    !SUPABASE_ANON_KEY.includes('your-anon-key')
  );
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const SupabaseService = {
  async getEvents(): Promise<AstroEvent[]> {
    if (!isSupabaseConfigured()) {
      return StorageService.getCachedEvents();
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error || !data || data.length === 0) {
        return StorageService.getCachedEvents();
      }

      const events: AstroEvent[] = data.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        event_date: item.event_date,
        instrument: item.instrument,
        direction: item.direction,
        description_tips: item.description_tips,
        image_url: item.image_url,
      }));

      await StorageService.saveCachedEvents(events);
      return events;
    } catch (err) {
      console.warn('Connessione Supabase non riuscita, uso cache:', err);
      return StorageService.getCachedEvents();
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
