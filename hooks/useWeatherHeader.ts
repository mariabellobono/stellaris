import { useEffect, useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { WeatherCondition } from '../types';
import { fetchNightWeather } from '../services/api/weather';

export function useWeatherHeader() {
  const [weather, setWeather] = useState<WeatherCondition | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadLocationAndWeather = useCallback(async () => {
    setLoading(true);
    let lat = 41.9028;
    let lon = 12.4964;
    let cityName = 'Roma';

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        lat = location.coords.latitude;
        lon = location.coords.longitude;

        const geocode = await Location.reverseGeocodeAsync({
          latitude: lat,
          longitude: lon,
        });

        if (geocode && geocode.length > 0) {
          cityName = geocode[0].city || geocode[0].region || 'Tua Posizione';
        }
      }
    } catch (e) {
      console.warn('Geolocalizzazione non disponibile, uso default:', e);
    }

    const data = await fetchNightWeather(lat, lon, cityName);
    setWeather(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadLocationAndWeather();
  }, [loadLocationAndWeather]);

  return {
    weather,
    loading,
    loadLocationAndWeather,
  };
}
