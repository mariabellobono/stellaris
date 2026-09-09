import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import { THEME } from '../constants/theme';
import {
  degreesToCardinal,
  degreesToShortCardinal,
} from '../utils/astroMath';
import { useISSCompass } from '../hooks/useISSCompass';
import {
  issCompassStyles as styles,
  COMPASS_SIZE,
  CARDINAL_POINTS,
  TICKS,
} from '../styles/iss-compass.styles';

interface ISSCompassScreenProps {
  onBack?: () => void;
}

export const ISSCompassScreen: React.FC<ISSCompassScreenProps> = ({ onBack }) => {
  const {
    issLocation,
    heading,
    provider,
    accuracy,
    sensitivity,
    setSensitivity,
    isSimulationMode,
    setManualHeading,
    toggleSimulation,
    calculationData,
    dialAnimatedStyle,
    isLoading,
  } = useISSCompass();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Superiore */}
        <View style={styles.header}>
          {onBack && (
            <TouchableOpacity style={styles.backBtn} onPress={onBack}>
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          <View style={styles.headerTitleGroup}>
            <Text style={styles.headerTitle}>BUSSOLA ISS 🛰️</Text>
            <Text style={styles.headerSubtitle}>
              Bussola con puntatore orbitale in tempo reale
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.simToggleBtn,
              isSimulationMode && styles.simToggleBtnActive,
            ]}
            onPress={toggleSimulation}
          >
            <Ionicons
              name={isSimulationMode ? 'game-controller' : 'game-controller-outline'}
              size={15}
              color={isSimulationMode ? '#FFFFFF' : THEME.colors.gold}
            />
            <Text
              style={[
                styles.simToggleText,
                isSimulationMode && styles.simToggleTextActive,
              ]}
            >
              {isSimulationMode ? 'Test Attivo' : 'Simula'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* GUIDA DINAMICA: BANNER STATO PUNTAMENTO */}
        <View
          style={[
            styles.guidanceBanner,
            calculationData.isAligned
              ? styles.guidanceBannerAligned
              : styles.guidanceBannerSearching,
          ]}
        >
          <Ionicons
            name={
              calculationData.isAligned
                ? 'checkmark-circle'
                : calculationData.guidance.direction === 'right'
                ? 'arrow-forward-circle'
                : calculationData.guidance.direction === 'left'
                ? 'arrow-back-circle'
                : 'compass'
            }
            size={24}
            color="#FFFFFF"
          />
          <View style={styles.guidanceBannerTextCol}>
            <Text style={styles.guidanceBannerTitle}>
              {calculationData.guidance.text}
            </Text>
            <Text style={styles.guidanceBannerSubtitle}>
              {calculationData.isAligned
                ? 'La Stazione Spaziale è esattamente nella tua linea visiva!'
                : `Allinea il pallino arancione ISS con la mira ▲ in alto`}
            </Text>
          </View>
        </View>

        {/* SELETTORE RAPIDO SENSIBILITÀ SENSORE */}
        <View style={styles.sensitivityRow}>
          <Text style={styles.sensitivityTitle}>Sensibilità Sensore:</Text>
          <View style={styles.sensitivityPills}>
            {(['HIGH', 'NORMAL', 'SMOOTH'] as const).map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.sensPill,
                  sensitivity === s && styles.sensPillActive,
                ]}
                onPress={() => setSensitivity(s)}
              >
                <Text
                  style={[
                    styles.sensPillText,
                    sensitivity === s && styles.sensPillTextActive,
                  ]}
                >
                  {s === 'HIGH' ? 'Reattiva (50Hz) ⚡' : s === 'NORMAL' ? 'Standard' : 'Fluida'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* STATO SENSORE E PRECISIONE */}
        <View style={styles.sensorStatusRow}>
          <View style={styles.sensorStatusBadge}>
            <View
              style={[
                styles.sensorStatusDot,
                {
                  backgroundColor:
                    provider === 'Simulazione'
                      ? THEME.colors.gold
                      : '#10B981',
                },
              ]}
            />
            <Text style={styles.sensorStatusText}>{provider}</Text>
          </View>

          <View style={styles.sensorStatusBadge}>
            <Ionicons
              name={accuracy >= 3 ? 'shield-checkmark' : 'shield-outline'}
              size={12}
              color={accuracy >= 3 ? '#10B981' : THEME.colors.gold}
            />
            <Text style={styles.sensorStatusText}>
              {accuracy >= 3 ? 'Precisione Ottimale (±1°)' : accuracy === 2 ? 'Precisione Media (±3°)' : 'Calibrazione Attiva'}
            </Text>
          </View>
        </View>

        {/* QUADRANTE DELLA BUSSOLA ROTANTE CON PALLINO ISS */}
        <View style={styles.compassWrapper}>
          {/* Indice Fisso Linea di Mira (Punta del telefono) */}
          <View style={styles.sightLineIndicator}>
            <View
              style={[
                styles.sightLineArrow,
                calculationData.isAligned && styles.sightLineArrowAligned,
              ]}
            />
            <Text
              style={[
                styles.sightLineText,
                calculationData.isAligned && styles.sightLineTextAligned,
              ]}
            >
              ▲ MIRA (DIREZIONE SGUARDO)
            </Text>
          </View>

          {/* Cerchio Esterno della Bussola */}
          <View style={[styles.compassBezel, { width: COMPASS_SIZE, height: COMPASS_SIZE }]}>
            {/* 1. ROSA DEI VENTI CHE RUOTA CON L'ORIENTAMENTO DEL TELEFONO */}
            <Animated.View style={[styles.rotatingRose, dialAnimatedStyle]}>
              {/* Ticks graduati ogni 30° lungo il perimetro */}
              {TICKS.map((deg) => (
                <View
                  key={`tick-${deg}`}
                  style={[
                    styles.tickMarkerContainer,
                    { transform: [{ rotate: `${deg}deg` }] },
                  ]}
                >
                  <View
                    style={[
                      styles.tickMark,
                      deg % 90 === 0 ? styles.tickMarkMajor : styles.tickMarkMinor,
                    ]}
                  />
                </View>
              ))}

              {/* Punti Cardinali posizionati trigonometricamente per gradi (N, NE, E, SE, S, SO, O, NO) */}
              {CARDINAL_POINTS.map((pt) => (
                <View
                  key={`cardinal-${pt.deg}`}
                  style={[
                    styles.cardinalContainer,
                    { transform: [{ rotate: `${pt.deg}deg` }] },
                  ]}
                >
                  <Text
                    style={[
                      pt.isMajor ? styles.cardinalMajorText : styles.cardinalMinorText,
                      pt.color ? { color: pt.color } : null,
                      { transform: [{ rotate: `-${pt.deg}deg` }] },
                    ]}
                  >
                    {pt.label}
                  </Text>
                </View>
              ))}

              {/* Anelli graduati radar */}
              <View style={styles.innerGraduationRing} />
              <View style={styles.orbitTrackRing} />
              <View style={styles.crosshairH} />
              <View style={styles.crosshairV} />

              {/* 2. IL PALLINO DELLA STAZIONE (ISS BLIP) */}
              <View
                style={[
                  styles.issBeaconContainer,
                  { transform: [{ rotate: `${calculationData.bearing}deg` }] },
                ]}
              >
                {/* Raggio radiale sottile verso il pallino */}
                <View style={styles.issRadialRay} />

                {/* Il Pallino della Stazione ISS */}
                <View
                  style={[
                    styles.issBlip,
                    calculationData.isAligned
                      ? styles.issBlipAligned
                      : styles.issBlipDefault,
                  ]}
                >
                  <View
                    style={[
                      styles.issBlipHalo,
                      calculationData.isAligned && styles.issBlipHaloAligned,
                    ]}
                  />
                  <Ionicons
                    name="planet"
                    size={16}
                    color={calculationData.isAligned ? '#FFFFFF' : '#0B0D17'}
                  />
                  <View
                    style={[
                      styles.issTagBadge,
                      calculationData.isAligned && styles.issTagBadgeAligned,
                    ]}
                  >
                    <Text style={styles.issTagText}>ISS 🛰️</Text>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Hub Centrale con Gradi della Rotta Attuale */}
            <View
              style={[
                styles.compassHub,
                calculationData.isAligned && styles.compassHubAligned,
              ]}
            >
              <Text style={styles.compassHubHeading}>
                {Math.round(heading)}°
              </Text>
              <Text style={styles.compassHubCardinal}>
                {degreesToShortCardinal(heading)}
              </Text>
            </View>
          </View>

          {/* Barra Informativa con Confronto Angolare */}
          <View style={styles.readoutBar}>
            <View style={styles.readoutCol}>
              <Text style={styles.readoutLabel}>Rotta Telefono (Prua)</Text>
              <Text style={styles.readoutVal}>{Math.round(heading)}°</Text>
              <Text style={styles.readoutSub}>{degreesToCardinal(heading)}</Text>
            </View>

            <View style={styles.readoutDivider} />

            <View style={styles.readoutCol}>
              <Text style={styles.readoutLabel}>Direzione ISS (Azimut)</Text>
              <Text
                style={[
                  styles.readoutVal,
                  calculationData.isAligned && { color: '#10B981' },
                ]}
              >
                {Math.round(calculationData.bearing)}°
              </Text>
              <Text style={styles.readoutSub}>
                {degreesToCardinal(calculationData.bearing)}
              </Text>
            </View>
          </View>
        </View>

        {/* PANNELLO DI TEST / SIMULATORE INTERATTIVO (per test immediato) */}
        {isSimulationMode && (
          <View style={styles.simulationPanel}>
            <View style={styles.simulationHeader}>
              <Ionicons name="game-controller" size={16} color={THEME.colors.gold} />
              <Text style={styles.simulationTitle}>SIMULATORE DI ROTAZIONE</Text>
            </View>
            <Text style={styles.simulationDesc}>
              Simula la rotazione del telefono per verificare il movimento della bussola e del pallino ISS:
            </Text>

            <View style={styles.simButtonsGrid}>
              <TouchableOpacity
                style={styles.simPresetBtn}
                onPress={() => setManualHeading(0)}
              >
                <Text style={styles.simPresetText}>Nord 0°</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.simPresetBtn}
                onPress={() => setManualHeading(90)}
              >
                <Text style={styles.simPresetText}>Est 90°</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.simPresetBtn}
                onPress={() => setManualHeading(180)}
              >
                <Text style={styles.simPresetText}>Sud 180°</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.simPresetBtn}
                onPress={() => setManualHeading(270)}
              >
                <Text style={styles.simPresetText}>Ovest 270°</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.simActionRow}>
              <TouchableOpacity
                style={styles.simStepBtn}
                onPress={() => setManualHeading(heading - 15)}
              >
                <Ionicons name="remove-circle-outline" size={16} color="#FFFFFF" />
                <Text style={styles.simStepText}>-15°</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.simAlignBtn}
                onPress={() => setManualHeading(Math.round(calculationData.bearing))}
              >
                <Ionicons name="locate" size={16} color="#FFFFFF" />
                <Text style={styles.simAlignText}>
                  🎯 Allinea con ISS ({Math.round(calculationData.bearing)}°)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.simStepBtn}
                onPress={() => setManualHeading(heading + 15)}
              >
                <Ionicons name="add-circle-outline" size={16} color="#FFFFFF" />
                <Text style={styles.simStepText}>+15°</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* SCHEDA DATI TELEMETRICI E ORBITALI */}
        <View style={styles.telemetryCard}>
          <Text style={styles.telemetryTitle}>DATI ORBITALI STAZIONE SPAZIALE</Text>

          {isLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={THEME.colors.accent} />
              <Text style={styles.loadingText}>Connessione satellite in corso...</Text>
            </View>
          ) : (
            <View style={styles.telemetryGrid}>
              <View style={styles.telemetryItem}>
                <Ionicons name="navigate-outline" size={16} color={THEME.colors.accent} />
                <View style={styles.telemetryTextCol}>
                  <Text style={styles.telemetryLabel}>Distanza Geografica</Text>
                  <Text style={styles.telemetryVal}>
                    {calculationData.distanceKm.toLocaleString('it-IT')} km
                  </Text>
                </View>
              </View>

              <View style={styles.telemetryItem}>
                <Ionicons name="arrow-up-circle-outline" size={16} color={THEME.colors.gold} />
                <View style={styles.telemetryTextCol}>
                  <Text style={styles.telemetryLabel}>Altitudine Orbitale</Text>
                  <Text style={styles.telemetryVal}>
                    ~{issLocation?.altitude || 420} km
                  </Text>
                </View>
              </View>

              <View style={styles.telemetryItem}>
                <Ionicons name="speedometer-outline" size={16} color="#06B6D4" />
                <View style={styles.telemetryTextCol}>
                  <Text style={styles.telemetryLabel}>Velocità Orbitale</Text>
                  <Text style={styles.telemetryVal}>
                    {issLocation?.velocity.toLocaleString('it-IT') || '27.600'} km/h
                  </Text>
                </View>
              </View>

              <View style={styles.telemetryItem}>
                <Ionicons name="pin-outline" size={16} color="#A855F7" />
                <View style={styles.telemetryTextCol}>
                  <Text style={styles.telemetryLabel}>Posizione Sub-Satellite</Text>
                  <Text style={styles.telemetryVal}>
                    {issLocation?.latitude.toFixed(2)}°, {issLocation?.longitude.toFixed(2)}°
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Spiegazione intuitiva */}
          <View style={styles.explanationBox}>
            <Ionicons name="information-circle-outline" size={16} color={THEME.colors.gold} />
            <Text style={styles.explanationText}>
              La bussola gira con l'orientamento del telefono, mentre il pallino arancione (ISS 🛰️) indica la direzione fisica della Stazione Spaziale. Ruota su te stesso fino a far coincidere il pallino con la linea di mira ▲ in alto per guardare verso la ISS.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
