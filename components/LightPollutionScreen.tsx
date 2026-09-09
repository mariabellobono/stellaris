import React, { useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { UrlTile, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useLightPollution } from '../hooks/useLightPollution';
import { AndroidDarkSkyMap, AndroidMapRef } from './AndroidDarkSkyMap';
import {
  OPACITY_PRESETS,
  lightPollutionStyles as styles,
} from '../styles/light-pollution.styles';

interface LightPollutionScreenProps {
  onBack?: () => void;
}

export const LightPollutionScreen: React.FC<LightPollutionScreenProps> = ({ onBack }) => {
  const mapRef = useRef<MapView | null>(null);
  const androidMapRef = useRef<AndroidMapRef | null>(null);

  const {
    userCoords,
    loadingLocation,
    permissionGranted,
    layerOpacity,
    tileConfig,
    isLegendOpen,
    toggleLegend,
    refreshLocation,
    activePresetIndex,
    handleSelectOpacityPreset,
    mapType,
    toggleMapType,
  } = useLightPollution();

  const handleCenterOnUser = () => {
    if (!userCoords) return;

    if (Platform.OS === 'android') {
      androidMapRef.current?.centerOnUser(userCoords.latitude, userCoords.longitude);
    } else {
      mapRef.current?.animateToRegion(
        {
          latitude: userCoords.latitude,
          longitude: userCoords.longitude,
          latitudeDelta: 1.2,
          longitudeDelta: 1.2,
        },
        800
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. SU ANDROID: MAPPA OPEN-SOURCE LEAFLET (100% Free, Zero Google Cloud / Zero API Key) */}
      {Platform.OS === 'android' ? (
        <AndroidDarkSkyMap
          ref={androidMapRef}
          latitude={userCoords.latitude}
          longitude={userCoords.longitude}
          layerOpacity={layerOpacity}
          mapType={mapType}
          tileUrl={tileConfig.tileUrlTemplate}
        />
      ) : (
        /* 2. SU IOS: MAPPA NATIVA APPLE MAPS (Free su iOS, Niente API key) */
        <MapView
          ref={mapRef}
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          mapType={mapType}
          userInterfaceStyle="dark"
          initialRegion={{
            latitude: userCoords.latitude,
            longitude: userCoords.longitude,
            latitudeDelta: 2.0,
            longitudeDelta: 2.0,
          }}
          showsUserLocation={permissionGranted}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
        >
          {layerOpacity > 0 && (
            <UrlTile
              urlTemplate={tileConfig.tileUrlTemplate}
              maximumZ={tileConfig.maximumZ}
              flipY={tileConfig.flipY}
              opacity={tileConfig.opacity}
              zIndex={tileConfig.zIndex}
              tileSize={256}
            />
          )}

          {userCoords && (
            <Marker
              coordinate={{
                latitude: userCoords.latitude,
                longitude: userCoords.longitude,
              }}
              title="La Tua Posizione"
              description="Punto di osservazione astronomica"
            >
              <View style={styles.markerContainer}>
                <View style={styles.markerHalo} />
                <View style={styles.markerCenter}>
                  <Ionicons name="telescope" size={14} color="#FFFFFF" />
                </View>
              </View>
            </Marker>
          )}
        </MapView>
      )}

      {/* OVERLAY INTERFACCIA UTENTE */}
      <SafeAreaView style={styles.overlaySafeArea} pointerEvents="box-none">
        {/* Barra Superiore con Tasto Indietro, Titolo e Info Legenda */}
        <View style={styles.topBar}>
          {onBack && (
            <TouchableOpacity style={styles.circleBtn} onPress={onBack}>
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          <View style={styles.topTitleBox}>
            <Text style={styles.topTitle}>MAPPA DARK SKY 🌌</Text>
            <Text style={styles.topSubtitle}>Inquinamento Luminoso • VIIRS HD</Text>
          </View>
          <TouchableOpacity
            style={[styles.circleBtn, isLegendOpen && styles.circleBtnActive]}
            onPress={toggleLegend}
          >
            <Ionicons
              name={isLegendOpen ? 'information-circle' : 'information-circle-outline'}
              size={22}
              color={isLegendOpen ? '#FFFFFF' : THEME.colors.gold}
            />
          </TouchableOpacity>
        </View>

        {/* Pulsanti Fluttuanti a Destra (Posizionati ordinatamente sotto la topBar, ZERO sovrapposizione!) */}
        <View style={styles.floatingControlsRight} pointerEvents="box-none">
          {/* Tasto Centra su Posizione Utente */}
          <TouchableOpacity
            style={styles.actionCircleBtn}
            onPress={handleCenterOnUser}
            activeOpacity={0.8}
          >
            <Ionicons name="locate" size={22} color={THEME.colors.accent} />
          </TouchableOpacity>

          {/* Cambio Tipo Mappa: Standard Notturna / Satellite */}
          <TouchableOpacity
            style={[
              styles.actionCircleBtn,
              mapType === 'satellite' && styles.actionCircleBtnActive,
            ]}
            onPress={toggleMapType}
            activeOpacity={0.8}
          >
            <Ionicons
              name={mapType === 'satellite' ? 'globe' : 'map'}
              size={20}
              color={mapType === 'satellite' ? '#FFFFFF' : THEME.colors.gold}
            />
          </TouchableOpacity>

          {/* Ricarica GPS */}
          <TouchableOpacity
            style={styles.actionCircleBtn}
            onPress={refreshLocation}
            activeOpacity={0.8}
          >
            {loadingLocation ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>

        {/* Spazio Flessibile per spingere i controlli inferiori in basso */}
        <View style={styles.spacer} pointerEvents="none" />

        {/* Barra Regolazione Opacità Rapida */}
        <View style={styles.opacityControlContainer}>
          <View style={styles.opacityHeaderRow}>
            <View style={styles.opacityLabelGroup}>
              <Ionicons name="bulb-outline" size={14} color={THEME.colors.gold} />
              <Text style={styles.opacityLabel}>
                Filtro Luci: {Math.round(layerOpacity * 100)}%
              </Text>
            </View>
            <Text style={styles.zoomHint}>Zoom fino a 16x 🔍</Text>
          </View>
          <View style={styles.presetButtonsRow}>
            {OPACITY_PRESETS.map((val, idx) => {
              const isSelected = activePresetIndex === idx;
              return (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.presetBtn,
                    isSelected && styles.presetBtnActive,
                  ]}
                  onPress={() => handleSelectOpacityPreset(val, idx)}
                >
                  <Text
                    style={[
                      styles.presetBtnText,
                      isSelected && styles.presetBtnTextActive,
                    ]}
                  >
                    {val === 0 ? 'Mappa' : `${Math.round(val * 100)}%`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Mini-Legenda a Comparsa in Basso */}
        {isLegendOpen && (
          <View style={styles.legendContainer}>
            <View style={styles.legendHeader}>
              <Text style={styles.legendTitle}>SCALA BORTLE DEL CIELO</Text>
              <TouchableOpacity onPress={toggleLegend}>
                <Ionicons name="chevron-down" size={18} color={THEME.colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Gradiente visivo a barre */}
            <View style={styles.gradientBar}>
              <View style={[styles.gradientSegment, { backgroundColor: '#0D1B2A' }]} />
              <View style={[styles.gradientSegment, { backgroundColor: '#1D4ED8' }]} />
              <View style={[styles.gradientSegment, { backgroundColor: '#059669' }]} />
              <View style={[styles.gradientSegment, { backgroundColor: '#D97706' }]} />
              <View style={[styles.gradientSegment, { backgroundColor: '#DC2626' }]} />
              <View style={[styles.gradientSegment, { backgroundColor: '#7F1D1D' }]} />
            </View>

            <View style={styles.legendLabelsRow}>
              <View style={styles.legendLabelGroup}>
                <Text style={styles.darkSkyText}>Bortle 1-3 (Cielo Buio)</Text>
                <Text style={styles.legendSubtext}>Ottimale per Deep-Sky e Via Lattea</Text>
              </View>
              <View style={[styles.legendLabelGroup, { alignItems: 'flex-end' }]}>
                <Text style={styles.pollutedText}>Bortle 6-9 (Inquinato)</Text>
                <Text style={styles.legendSubtext}>Visibili solo Luna e Pianeti</Text>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};
