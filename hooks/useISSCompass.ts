import { useEffect, useState, useMemo, useRef } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Location from 'expo-location';
import { useISSLocation } from './useISSLocation';
import { useDeviceCompass, CompassSensitivity } from './useDeviceCompass';
import {
  calculateBearing,
  calculateHaversineDistance,
  calculateRotationAngle,
  isAngleAligned,
  getShortestAngleDiff,
  getTurnGuidance,
} from '../utils/astroMath';
import { DeviceCoordinates } from '../types';

export function useISSCompass() {
  const { issLocation, loading: issLoading, error: issError, lastUpdated } = useISSLocation();
  const {
    heading,
    sensorAvailable,
    hasPermission,
    isCalibrating,
    provider,
    accuracy,
    sensitivity,
    setSensitivity,
    isSimulationMode,
    setManualHeading,
    toggleSimulation,
  } = useDeviceCompass('HIGH');

  const [userCoords, setUserCoords] = useState<DeviceCoordinates | null>(null);
  const [gpsLoading, setGpsLoading] = useState<boolean>(true);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Reanimated shared value per la rotazione fluida della rosa della bussola
  const animatedDialRotation = useSharedValue<number>(0);
  const lastDialAngleRef = useRef<number>(0);

  // 1. Rilevamento coordinate GPS dell'utente
  useEffect(() => {
    async function getUserLocation() {
      try {
        setGpsLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setGpsError('Permessi GPS non concessi. Utilizzo coordinate predefinite.');
          setUserCoords({ latitude: 41.9028, longitude: 12.4964 });
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setUserCoords({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          altitude: loc.coords.altitude,
        });
      } catch (err) {
        console.warn('Errore lettura posizione utente:', err);
        setGpsError('Posizione GPS non rilevata. Uso coordinate approssimate.');
        setUserCoords({ latitude: 41.9028, longitude: 12.4964 });
      } finally {
        setGpsLoading(false);
      }
    }

    getUserLocation();
  }, []);

  // 2. Calcolo del Bearing e della Distanza ortodromica
  const calculationData = useMemo(() => {
    if (!userCoords || !issLocation) {
      return {
        bearing: 0,
        distanceKm: 0,
        rotationAngle: 0,
        isAligned: false,
        guidance: {
          aligned: false,
          text: 'Connessione ai dati orbitali...',
          diffDeg: 0,
          direction: 'center' as const,
        },
      };
    }

    const bearing = calculateBearing(
      userCoords.latitude,
      userCoords.longitude,
      issLocation.latitude,
      issLocation.longitude
    );

    const distanceKm = calculateHaversineDistance(
      userCoords.latitude,
      userCoords.longitude,
      issLocation.latitude,
      issLocation.longitude
    );

    const rotationAngle = calculateRotationAngle(bearing, heading);
    const isAligned = isAngleAligned(rotationAngle, 10);
    const guidance = getTurnGuidance(rotationAngle);

    return {
      bearing,
      distanceKm,
      rotationAngle,
      isAligned,
      guidance,
    };
  }, [userCoords, issLocation, heading]);

  // 3. Rotazione fluida della Rosa dei Venti (gira con -heading per tenere N al Nord fisico)
  useEffect(() => {
    const targetDialAngle = -heading;
    const dialDiff = getShortestAngleDiff(targetDialAngle, lastDialAngleRef.current);
    const continuousDialAngle = lastDialAngleRef.current + dialDiff;
    lastDialAngleRef.current = continuousDialAngle;

    animatedDialRotation.value = withSpring(continuousDialAngle, {
      damping: sensitivity === 'HIGH' ? 32 : 28,
      stiffness: sensitivity === 'HIGH' ? 380 : 280,
      mass: sensitivity === 'HIGH' ? 0.08 : 0.16,
    });
  }, [heading, animatedDialRotation, sensitivity]);

  const dialAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${animatedDialRotation.value}deg` }],
  }));

  const isLoading = (issLoading && !issLocation) || (gpsLoading && !userCoords);

  return {
    // ISS Telemetry
    issLocation,
    issLoading,
    issError,
    lastUpdated,
    // Device Compass & Sensors
    heading,
    sensorAvailable,
    hasPermission,
    isCalibrating,
    provider,
    accuracy,
    sensitivity,
    setSensitivity,
    // Simulation controls
    isSimulationMode,
    setManualHeading,
    toggleSimulation,
    // User GPS
    userCoords,
    gpsLoading,
    gpsError,
    // Computed Math & Guidance
    calculationData,
    dialAnimatedStyle,
    isLoading,
  };
}
