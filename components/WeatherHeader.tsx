import React from 'react';
import { Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useWeatherHeader } from '../hooks/useWeatherHeader';
import {
  weatherHeaderStyles as styles,
  getBadgeColor,
} from '../styles/weather-header.styles';

export const WeatherHeader: React.FC = () => {
  const { weather, loading, loadLocationAndWeather } = useWeatherHeader();

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
