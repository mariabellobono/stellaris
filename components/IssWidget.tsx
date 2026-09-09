import React from 'react';
import { Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useISSLocation } from '../hooks/useISSLocation';
import { issWidgetStyles as styles } from '../styles/iss-widget.styles';

export const IssWidget: React.FC = () => {
  const router = useRouter();
  const { issLocation: iss, loading } = useISSLocation();

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
              <Text style={styles.value}>{iss.velocity.toLocaleString('it-IT')} km/h</Text>
            </View>
          </View>

          {/* Rappresentazione visuale / Radar di tracciamento */}
          <View style={styles.radarCard}>
            <Ionicons name="planet-outline" size={24} color={THEME.colors.gold} />
            <Text style={styles.radarText}>
              Orbita a ~27.600 km/h: compie un giro completo della Terra ogni 90 minuti.
            </Text>
          </View>

          {/* Pulsante di Azione: Bussola Direzionale */}
          <TouchableOpacity
            style={styles.compassButton}
            activeOpacity={0.85}
            onPress={() => router.push('/iss-compass' as any)}
          >
            <Ionicons name="compass-outline" size={18} color="#FFFFFF" />
            <Text style={styles.compassButtonText}>
              Apri Bussola Direzionale 🧭
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};
