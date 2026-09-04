import AsyncStorage from '@react-native-async-storage/async-storage';
import { AstroEvent, NasaApod, WeatherCondition } from '../types';
import { INITIAL_ASTRONOMICAL_EVENTS } from '../data/mockEvents';

const KEYS = {
  FAVORITES: '@stellaris_favorites',
  OBSERVED: '@stellaris_observed',
  CACHED_EVENTS: '@stellaris_cached_events',
  CACHED_WEATHER: '@stellaris_cached_weather',
  CACHED_APOD: '@stellaris_cached_apod',
};

export const StorageService = {
  // --- PREFERITI ---
  async getFavorites(): Promise<string[]> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.FAVORITES);
      return raw ? JSON.parse(raw) : [];
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

  // --- OSSERVATI (PASSAPORTO ASTRONOMICO) ---
  async getObserved(): Promise<string[]> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.OBSERVED);
      return raw ? JSON.parse(raw) : [];
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

  // --- CACHE EVENTI (OFFLINE-FIRST) ---
  async getCachedEvents(): Promise<AstroEvent[]> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.CACHED_EVENTS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      await this.saveCachedEvents(INITIAL_ASTRONOMICAL_EVENTS);
      return INITIAL_ASTRONOMICAL_EVENTS;
    } catch (error) {
      console.error('Errore lettura cache eventi:', error);
      return INITIAL_ASTRONOMICAL_EVENTS;
    }
  },

  async saveCachedEvents(events: AstroEvent[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.CACHED_EVENTS, JSON.stringify(events));
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
};
