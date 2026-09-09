import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { makeRedirectUri } from 'expo-auth-session';
import { AstroEvent, UserEventState, DexCard, UserUnlock } from '../types';
import { StorageService } from './storage';


WebBrowser.maybeCompleteAuthSession();

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

  async signInWithGoogle(): Promise<any> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase non è configurato con chiavi valide in .env');
    }

    const redirectUrl = makeRedirectUri({
      native: 'stellaris://auth/callback',
      path: 'auth/callback',
    });
    console.log('[Supabase OAuth] redirectUrl calcolato:', redirectUrl);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;
    if (!data?.url) {
      throw new Error('Impossibile ottenere l\'URL di autenticazione da Supabase.');
    }

    try {
      // Timeout di sicurezza (40 secondi) se il browser nativo non invia l'evento di chiusura
      const timeoutPromise = new Promise<{ type: 'timeout' }>((resolve) =>
        setTimeout(() => resolve({ type: 'timeout' }), 40000)
      );

      const authPromise = WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
      const result = await Promise.race([authPromise, timeoutPromise]);

      if (result.type === 'success' && 'url' in result && result.url) {
        const url = result.url;
        const params: Record<string, string> = {};

        // Estrai parametri sia dalla query string (?...) che dall'hash fragment (#...)
        const queryString = url.split('#')[0]?.split('?')[1] || '';
        const hashString = url.split('#')[1] || '';

        const parseSection = (str: string) => {
          if (!str) return;
          const pairs = str.split('&');
          for (const pair of pairs) {
            const [k, v] = pair.split('=');
            if (k && v) {
              params[decodeURIComponent(k)] = decodeURIComponent(v);
            }
          }
        };

        parseSection(queryString);
        parseSection(hashString);

        if (params.access_token && params.refresh_token) {
          const { data: sessionData, error: sessionErr } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });
          if (sessionErr) throw sessionErr;
          return sessionData.user;
        } else if (params.code) {
          const { data: codeData, error: codeErr } =
            await supabase.auth.exchangeCodeForSession(params.code);
          if (codeErr) throw codeErr;
          return codeData.user;
        }
      }
    } finally {
      try {
        WebBrowser.dismissAuthSession();
      } catch {}
    }

    // Controlla se nel frattempo la sessione è già stata impostata (es. dal deep link listener o callback route)
    const { data: currentSession } = await supabase.auth.getSession();
    if (currentSession?.session?.user) {
      return currentSession.session.user;
    }

    return null;
  },

  // ==========================================
  // ASTRO-DEX SERVICE (COLLEZIONISMO EVENTI)
  // ==========================================
  async getDexCards(): Promise<DexCard[]> {
    // 1. Prova a leggere da Supabase
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('dex_cards')
          .select('*')
          .order('created_at', { ascending: true });

        if (!error && data && data.length > 0) {
          const cards: DexCard[] = data.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description || '',
            rarity: item.rarity,
            icon_url: item.icon_url || '',
            created_at: item.created_at,
          }));
          await StorageService.saveCachedDexCards(cards);
          return cards;
        }
      } catch (err) {
        console.warn('Errore lettura dex_cards da Supabase, fallback a cache/default:', err);
      }
    }

    // 2. Fallback su cache locale
    const cached = await StorageService.getCachedDexCards();
    if (cached && cached.length > 0) {
      return cached;
    }

    // 3. Fallback sul catalogo predefinito
    await StorageService.saveCachedDexCards(FALLBACK_DEX_CARDS);
    return FALLBACK_DEX_CARDS;
  },

  async getUserUnlocks(userId: string): Promise<UserUnlock[]> {
    if (!userId || !isSupabaseConfigured()) {
      // In modalità offline o guest, mappa gli ID locali
      const localIds = await StorageService.getDexUnlocks();
      return localIds.map((cardId) => ({
        id: cardId,
        user_id: userId || 'local_guest',
        card_id: cardId,
        unlocked_at: new Date().toISOString(),
      }));
    }

    try {
      const { data, error } = await supabase
        .from('user_unlocks')
        .select('*')
        .eq('user_id', userId);

      if (!error && data) {
        // Unisci eventuali sblocchi locali non ancora sincronizzati
        const localIds = await StorageService.getDexUnlocks();
        const remoteCardIds = new Set(data.map((u: any) => u.card_id));
        
        for (const localId of localIds) {
          if (!remoteCardIds.has(localId)) {
            // Sincronizza lo sblocco offline sul cloud
            await this.unlockCard(userId, localId);
            remoteCardIds.add(localId);
            data.push({
              id: localId,
              user_id: userId,
              card_id: localId,
              unlocked_at: new Date().toISOString(),
            });
          }
        }

        return data as UserUnlock[];
      }
    } catch (err) {
      console.warn('Errore lettura user_unlocks da Supabase:', err);
    }

    // Fallback locale
    const localIds = await StorageService.getDexUnlocks();
    return localIds.map((cardId) => ({
      id: cardId,
      user_id: userId,
      card_id: cardId,
      unlocked_at: new Date().toISOString(),
    }));
  },

  async unlockCard(userId: string | null, cardId: string): Promise<boolean> {
    // 1. Salva sempre in locale per reattività immediata e offline-first
    await StorageService.unlockCardLocally(cardId);

    // 2. Se l'utente è loggato e Supabase è configurato, sincronizza con il database remoto
    if (userId && isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('user_unlocks').upsert(
          {
            user_id: userId,
            card_id: cardId,
            unlocked_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,card_id' }
        );

        if (error) {
          console.warn('Errore salvataggio sblocco Astro-Dex su Supabase:', error);
          return false;
        }
      } catch (err) {
        console.warn('Errore sync remoto unlockCard:', err);
        return false;
      }
    }

    return true;
  },
};

export const FALLBACK_DEX_CARDS: DexCard[] = [
  {
    id: 'card_perseidi',
    title: 'Sciame delle Perseidi',
    description:
      'Le "Lacrime di San Lorenzo", generate dai detriti della cometa Swift-Tuttle che impattano l\'atmosfera a 59 km/s.',
    rarity: 'COMMON',
    icon_url:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'card_iss_pass',
    title: 'Transito Stazione ISS',
    description:
      'Avvistamento a occhio nudo della Stazione Spaziale Internazionale mentre brilla intensamente per riflessione solare a 400 km di quota.',
    rarity: 'COMMON',
    icon_url:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'card_supermoon',
    title: 'Superluna al Perigeo',
    description:
      'Fase di Luna Piena in coincidenza con il perigeo orbitale: appare fino al 14% più grande e al 30% più luminosa.',
    rarity: 'COMMON',
    icon_url:
      'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'card_geminidi',
    title: 'Sciame delle Geminidi',
    description:
      'Uno dei più ricchi e spettacolari sciami meteorici dell\'anno, originato dal misterioso asteroide 3200 Phaethon.',
    rarity: 'RARE',
    icon_url:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'card_pleiadi',
    title: 'Pleiadi (M45) e Toro',
    description:
      'Ammasso aperto composto da calde stelle giganti blu avvolte da una delicata nebulosa a riflessione.',
    rarity: 'RARE',
    icon_url:
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'card_planetary_alignment',
    title: 'Allineamento Planetario',
    description:
      'Rara configurazione in cui molteplici pianeti maggiori appaiono disposti lungo la linea dell\'eclittica nel cielo notturno.',
    rarity: 'RARE',
    icon_url:
      'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'card_solar_eclipse',
    title: 'Eclissi Solare Totale',
    description:
      'La Luna si interpone perfettamente tra la Terra e il Sole, svelando l\'eterea corona solare in pieno giorno.',
    rarity: 'EPIC',
    icon_url:
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'card_aurora_borealis',
    title: 'Tempesta Geomagnetica & Aurora',
    description:
      'Le particelle cariche del vento solare si incanalano nel campo magnetico terrestre eccitando atomi di ossigeno e azoto.',
    rarity: 'EPIC',
    icon_url:
      'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?auto=format&fit=crop&w=800&q=80',
  },
];

