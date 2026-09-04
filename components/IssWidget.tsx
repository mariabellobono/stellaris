import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { IssLocation } from '../types';
import { fetchIssLocation } from '../services/api/iss';

export const IssWidget: React.FC = () => {
  const [iss, setIss] = useState<IssLocation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  const updatePosition = async () => {
    const data = await fetchIssLocation();
    if (data) {
      setIss(data);
      setLastUpdated(Date.now());
    }
    setLoading(false);
  };

  useEffect(() => {
    updatePosition();
    // Aggiornamento ogni 10 secondi come da specifiche
    const interval = setInterval(() => {
      updatePosition();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.pulseDot} />
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            TRACKER LIVE ISS
          </Text>
        </View>
        <View style={styles.badgeContainer}>
          <Ionicons
            name="sync-outline"
            size={11}
            color={THEME.colors.accent}
            style={styles.badgeIcon}
          />
          <Text style={styles.badge}>Aggiorna ogni 10s</Text>
        </View>
      </View>

      {loading && !iss ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={THEME.colors.accent} />
          <Text style={styles.loadingText}>Connessione telemetria orbitale...</Text>
        </View>
      ) : iss ? (
        <View style={styles.body}>
          {/* Coordinate e Dati Orbitale */}
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Latitudine</Text>
              <Text style={styles.value}>{iss.latitude}°</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Longitudine</Text>
              <Text style={styles.value}>{iss.longitude}°</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Altitudine</Text>
              <Text style={styles.value}>{iss.altitude} km</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Velocità</Text>
              <Text style={styles.value}>{iss.velocity} km/h</Text>
            </View>
          </View>

          {/* Rappresentazione visuale / Radar di tracciamento */}
          <View style={styles.radarCard}>
            <Ionicons name="planet-outline" size={24} color={THEME.colors.gold} />
            <Text style={styles.radarText}>
              Orbita a ~27.600 km/h: compie un giro completo della Terra ogni 90 minuti.
            </Text>
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
    marginBottom: THEME.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.accent,
    marginRight: 8,
    flexShrink: 0,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    flexShrink: 0,
  },
  badgeIcon: {
    marginRight: 4,
  },
  badge: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  loadingText: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    marginLeft: 8,
  },
  body: {
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#1C202D',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#262C3E',
  },
  label: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  radarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 183, 3, 0.08)',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 183, 3, 0.2)',
  },
  radarText: {
    color: '#E0E0E0',
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
});
