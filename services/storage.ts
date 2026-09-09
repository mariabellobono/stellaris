import AsyncStorage from '@react-native-async-storage/async-storage';
import { AstroEvent, NasaApod, WeatherCondition, DexCard } from '../types';

const KEYS = {
  FAVORITES: '@stellaris_favorites',
  OBSERVED: '@stellaris_observed',
  CACHED_EVENTS: '@stellaris_cached_events',
  CACHED_WEATHER: '@stellaris_cached_weather',
  CACHED_APOD: '@stellaris_cached_apod',
  DEX_CARDS: '@stellaris_dex_cards',
  DEX_UNLOCKS: '@stellaris_dex_unlocks',
};


export const StorageService = {
  // --- PREFERITI ---
  async getFavorites(): Promise<string[]> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.FAVORITES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter((id) => !id.startsWith('e100') && !id.startsWith('mock'));
        }
      }
      return [];
    } catch (error) {
      console.error('Errore lettura preferiti:', error);
      return [];
    }
  },

  async toggleFavorite(eventId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      const exists = favorites.includes(eventId);
      const updated = exists
        ? favorites.filter((id) => id !== eventId)
        : [...favorites, eventId];
      await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
      return !exists;
    } catch (error) {
      console.error('Errore toggle preferito:', error);
      return false;
    }
  },

  async isFavorite(eventId: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    return favorites.includes(eventId);
  },

  async saveFavorites(favorites: string[]): Promise<void> {
    try {
      const sanitized = favorites.filter((id) => !id.startsWith('e100') && !id.startsWith('mock'));
      await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(sanitized));
    } catch (error) {
      console.error('Errore salvataggio preferiti:', error);
    }
  },

  // --- OSSERVATI (PASSAPORTO ASTRONOMICO) ---
  async getObserved(): Promise<string[]> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.OBSERVED);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter((id) => !id.startsWith('e100') && !id.startsWith('mock'));
        }
      }
      return [];
    } catch (error) {
      console.error('Errore lettura eventi osservati:', error);
      return [];
    }
  },

  async toggleObserved(eventId: string): Promise<boolean> {
    try {
      const observed = await this.getObserved();
      const exists = observed.includes(eventId);
      const updated = exists
        ? observed.filter((id) => id !== eventId)
        : [...observed, eventId];
      await AsyncStorage.setItem(KEYS.OBSERVED, JSON.stringify(updated));
      return !exists;
    } catch (error) {
      console.error('Errore toggle osservato:', error);
      return false;
    }
  },

  async isObserved(eventId: string): Promise<boolean> {
    const observed = await this.getObserved();
    return observed.includes(eventId);
  },

  async saveObserved(observed: string[]): Promise<void> {
    try {
      const sanitized = observed.filter((id) => !id.startsWith('e100') && !id.startsWith('mock'));
      await AsyncStorage.setItem(KEYS.OBSERVED, JSON.stringify(sanitized));
    } catch (error) {
      console.error('Errore salvataggio osservati:', error);
    }
  },

  // --- CACHE EVENTI (OFFLINE-FIRST) ---
  async getCachedEvents(): Promise<AstroEvent[]> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.CACHED_EVENTS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Rimuove definitivamente i vecchi mock preset e le immagini anomale (joystick)
          const sanitized = parsed.filter(
            (ev) =>
              ev &&
              !ev.id.startsWith('e100') &&
              !ev.id.startsWith('mock') &&
              !ev.image_url?.includes('1509198397868-475647b2a1e5')
          );
          if (sanitized.length !== parsed.length) {
            await AsyncStorage.setItem(KEYS.CACHED_EVENTS, JSON.stringify(sanitized));
          }
          return sanitized;
        }
      }
      return [];
    } catch (error) {
      console.error('Errore lettura cache eventi:', error);
      return [];
    }
  },

  async clearLegacyEvents(): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.CACHED_EVENTS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const sanitized = parsed.filter(
            (ev) =>
              ev &&
              !ev.id.startsWith('e100') &&
              !ev.id.startsWith('mock') &&
              !ev.image_url?.includes('1509198397868-475647b2a1e5')
          );
          await AsyncStorage.setItem(KEYS.CACHED_EVENTS, JSON.stringify(sanitized));
        }
      }
    } catch (error) {
      console.error('Errore pulizia eventi legacy:', error);
    }
  },

  async saveCachedEvents(events: AstroEvent[]): Promise<void> {
    try {
      const sanitized = events.filter(
        (ev) =>
          ev &&
          !ev.id.startsWith('e100') &&
          !ev.id.startsWith('mock') &&
          !ev.image_url?.includes('1509198397868-475647b2a1e5')
      );
      await AsyncStorage.setItem(KEYS.CACHED_EVENTS, JSON.stringify(sanitized));
    } catch (error) {
      console.error('Errore salvataggio cache eventi:', error);
    }
  },

  // --- CACHE METEO ---
  async getCachedWeather(): Promise<WeatherCondition | null> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.CACHED_WEATHER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async saveCachedWeather(weather: WeatherCondition): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.CACHED_WEATHER, JSON.stringify(weather));
    } catch (error) {
      console.error('Errore salvataggio meteo cache:', error);
    }
  },

  // --- CACHE NASA APOD ---
  async getCachedApod(): Promise<NasaApod | null> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.CACHED_APOD);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async saveCachedApod(apod: NasaApod): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.CACHED_APOD, JSON.stringify(apod));
    } catch (error) {
      console.error('Errore salvataggio APOD cache:', error);
    }
  },

  // --- ASTRO-DEX (COLLEZIONISMO OFFLINE-FIRST) ---
  async getDexUnlocks(): Promise<string[]> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.DEX_UNLOCKS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      return [];
    } catch (error) {
      console.error('Errore lettura sblocchi Astro-Dex:', error);
      return [];
    }
  },

  async saveDexUnlocks(cardIds: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.DEX_UNLOCKS, JSON.stringify(cardIds));
    } catch (error) {
      console.error('Errore salvataggio sblocchi Astro-Dex:', error);
    }
  },

  async isCardUnlocked(cardId: string): Promise<boolean> {
    const unlocks = await this.getDexUnlocks();
    return unlocks.includes(cardId);
  },

  async unlockCardLocally(cardId: string): Promise<boolean> {
    try {
      const current = await this.getDexUnlocks();
      if (!current.includes(cardId)) {
        const updated = [...current, cardId];
        await AsyncStorage.setItem(KEYS.DEX_UNLOCKS, JSON.stringify(updated));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Errore sblocco locale carta:', error);
      return false;
    }
  },

  async getCachedDexCards(): Promise<DexCard[]> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.DEX_CARDS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      return [];
    } catch (error) {
      console.error('Errore lettura cache dex_cards:', error);
      return [];
    }
  },

  async saveCachedDexCards(cards: DexCard[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.DEX_CARDS, JSON.stringify(cards));
    } catch (error) {
      console.error('Errore salvataggio cache dex_cards:', error);
    }
  },
};

