import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { WeatherCondition } from '../types';
import { fetchNightWeather } from '../services/api/weather';

export const WeatherHeader: React.FC = () => {
  const [weather, setWeather] = useState<WeatherCondition | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadLocationAndWeather = async () => {
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
  };

  useEffect(() => {
    loadLocationAndWeather();
  }, []);

  const getBadgeColor = (status: WeatherCondition['skyStatus']) => {
    switch (status) {
      case 'Ottimale':
        return THEME.colors.success;
      case 'Buono':
        return '#3A86FF';
      case 'Parzialmente Nuvoloso':
        return THEME.colors.warning;
      case 'Coperto':
        return THEME.colors.accent;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={16} color={THEME.colors.accent} />
          <Text style={styles.cityText}>{weather?.city || 'Rilevamento...'}</Text>
        </View>
        <TouchableOpacity
          onPress={loadLocationAndWeather}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="refresh" size={18} color={THEME.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color={THEME.colors.accent} />
          <Text style={styles.loadingText}>Calcolo condizioni cielo notturno...</Text>
        </View>
      ) : weather ? (
        <View style={styles.contentRow}>
          {/* Valutazione Visibilità Notturna */}
          <View style={styles.visibilityCard}>
            <View style={styles.visibilityHeader}>
              <Ionicons name="telescope-outline" size={20} color={THEME.colors.gold} />
              <Text style={styles.visibilityLabel}>Visibilità Notte (dalle 21:00)</Text>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.visibilityPercent}>
                {weather.visibilityPercentage}%
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getBadgeColor(weather.skyStatus) },
                ]}
              >
                <Text style={styles.statusText}>{weather.skyStatus}</Text>
              </View>
            </View>

            {/* Barra visuale di limpidezza del cielo */}
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${weather.visibilityPercentage}%`,
                    backgroundColor: getBadgeColor(weather.skyStatus),
                  },
                ]}
              />
            </View>

            <View style={styles.statsFooter}>
              <Text style={styles.footerText}>
                Copertura Nuvole: <Text style={styles.boldText}>{weather.cloudCover}%</Text>
              </Text>
              <Text style={styles.footerText}>
                Temp Serale: <Text style={styles.boldText}>{weather.temperature}°C</Text>
              </Text>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    marginBottom: THEME.spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityText: {
    color: THEME.colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 6,
  },
  loadingBox: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    marginLeft: 10,
  },
  contentRow: {
    marginTop: 4,
  },
  visibilityCard: {},
  visibilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  visibilityLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  visibilityPercent: {
    color: THEME.colors.text,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: THEME.borderRadius.round,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#25293A',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  statsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  footerText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
  },
  boldText: {
    color: THEME.colors.text,
    fontWeight: '600',
  },
});
