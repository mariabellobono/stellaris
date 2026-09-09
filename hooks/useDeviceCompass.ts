import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import { Magnetometer, Accelerometer } from 'expo-sensors';
import * as Location from 'expo-location';
import {
  calculateTiltCompensatedHeading,
  adaptiveSmoothAngle,
} from '../utils/astroMath';

export type CompassSensitivity = 'HIGH' | 'NORMAL' | 'SMOOTH';
export type CompassProvider =
  | 'CoreLocation 9-Assi'
  | 'SensorManager 9-Assi'
  | 'Magnetometro 3D'
  | 'Simulazione';

export function useDeviceCompass(initialSensitivity: CompassSensitivity = 'HIGH') {
  const [heading, setHeading] = useState<number>(0);
  const [rawHeading, setRawHeading] = useState<number>(0);
  const [sensorAvailable, setSensorAvailable] = useState<boolean>(true);
  const [hasPermission, setHasPermission] = useState<boolean>(true);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(true);
  const [provider, setProvider] = useState<CompassProvider>('CoreLocation 9-Assi');
  const [accuracy, setAccuracy] = useState<number>(3);
  const [sensitivity, setSensitivity] = useState<CompassSensitivity>(initialSensitivity);
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(false);
  const [simulatedHeading, setSimulatedHeadingState] = useState<number>(0);

  // Riferimenti per sincronizzazione real-time a 50Hz senza re-render superflui
  const currentHeadingRef = useRef<number>(0);
  const lastStateUpdateRef = useRef<number>(0);
  const sensitivityRef = useRef<CompassSensitivity>(sensitivity);
  const isSimulationModeRef = useRef<boolean>(isSimulationMode);
  const hasReceivedPrimaryHeadingRef = useRef<boolean>(false);

  // Ultimi valori registrati dall'accelerometro (per fallback magnetometro 3D)
  const accelRef = useRef<{ x: number; y: number; z: number }>({
    x: 0,
    y: 0,
    z: Platform.OS === 'ios' ? -1 : 1,
  });

  useEffect(() => {
    sensitivityRef.current = sensitivity;
  }, [sensitivity]);

  useEffect(() => {
    isSimulationModeRef.current = isSimulationMode;
  }, [isSimulationMode]);

  useEffect(() => {
    let magnetometerSub: any = null;
    let accelerometerSub: any = null;
    let locationHeadingSub: any = null;
    let fallbackTimer: any = null;
    let isMounted = true;

    async function startCompass() {
      try {
        hasReceivedPrimaryHeadingRef.current = false;

        // 1. PRIMARIA: Location.watchHeadingAsync
        // Fornisce la rotta hardware fusa (Giroscopio + Accelerometro + Magnetometro)
        // nativa di iOS (CLHeading) e Android (SensorManager).
        // È già tilt-compensata dal sistema operativo e immune a beccheggio/rollio.
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            setHasPermission(true);

            locationHeadingSub = await Location.watchHeadingAsync(
              (headingData) => {
                if (!isMounted || isSimulationModeRef.current) return;

                // trueHeading è riferito al Nord geografico (allineato con le coordinate GPS e ISS).
                // Se non disponibile (< 0), usa magHeading (Nord magnetico).
                const compHeading =
                  headingData.trueHeading >= 0
                    ? headingData.trueHeading
                    : headingData.magHeading;

                if (compHeading >= 0) {
                  hasReceivedPrimaryHeadingRef.current = true;
                  setProvider(
                    Platform.OS === 'ios' ? 'CoreLocation 9-Assi' : 'SensorManager 9-Assi'
                  );
                  if (headingData.accuracy !== undefined) {
                    setAccuracy(headingData.accuracy);
                  }
                  setRawHeading(compHeading);

                  const smoothed = adaptiveSmoothAngle(
                    currentHeadingRef.current,
                    compHeading,
                    sensitivityRef.current
                  );
                  currentHeadingRef.current = smoothed;

                  const now = Date.now();
                  if (now - lastStateUpdateRef.current >= 20) {
                    lastStateUpdateRef.current = now;
                    setHeading(Math.round(smoothed * 10) / 10);
                    setIsCalibrating(false);
                    setSensorAvailable(true);
                  }
                }
              },
              (err) => {
                console.warn('Errore streaming Location.watchHeadingAsync:', err);
              }
            );
          } else {
            setHasPermission(false);
          }
        } catch (locErr) {
          console.warn('Location.watchHeadingAsync non disponibile:', locErr);
        }

        // 2. FALLBACK SECONDARIO: Accelerometro + Magnetometro con proiezione 3D
        // Si attiva se il provider primario non fornisce dati dopo 800ms o se mancano i permessi.
        const startFallbackSensors = async () => {
          if (!isMounted || hasReceivedPrimaryHeadingRef.current) return;

          const isMagAvailable = await Magnetometer.isAvailableAsync();
          const isAccAvailable = await Accelerometer.isAvailableAsync();

          if (isAccAvailable && !accelerometerSub) {
            Accelerometer.setUpdateInterval(25);
            accelerometerSub = Accelerometer.addListener((accData) => {
              accelRef.current = { x: accData.x, y: accData.y, z: accData.z };
            });
          }

          if (isMagAvailable && !magnetometerSub) {
            setSensorAvailable(true);
            Magnetometer.setUpdateInterval(25);

            magnetometerSub = Magnetometer.addListener((magData) => {
              if (!isMounted || isSimulationModeRef.current) return;

              // Se il provider primario è attivo, non sovrascrivere
              if (hasReceivedPrimaryHeadingRef.current) return;

              setProvider('Magnetometro 3D');
              const a = accelRef.current;
              const computedRaw = calculateTiltCompensatedHeading(
                magData.x,
                magData.y,
                magData.z,
                a.x,
                a.y,
                a.z,
                Platform.OS === 'ios'
              );

              setRawHeading(computedRaw);

              const smoothed = adaptiveSmoothAngle(
                currentHeadingRef.current,
                computedRaw,
                sensitivityRef.current
              );
              currentHeadingRef.current = smoothed;

              const now = Date.now();
              if (now - lastStateUpdateRef.current >= 20) {
                lastStateUpdateRef.current = now;
                setHeading(Math.round(smoothed * 10) / 10);
                setIsCalibrating(false);
              }
            });
          }
        };

        // Se dopo 800ms il primario non ha inviato dati, attiva il fallback
        fallbackTimer = setTimeout(() => {
          if (!hasReceivedPrimaryHeadingRef.current) {
            startFallbackSensors();
          }
        }, 800);
      } catch (err) {
        console.warn("Errore nell'avvio dei sensori bussola:", err);
        setSensorAvailable(false);
      }
    }

    if (!isSimulationMode) {
      startCompass();
    }

    return () => {
      isMounted = false;
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (magnetometerSub && typeof magnetometerSub.remove === 'function') {
        magnetometerSub.remove();
      }
      if (accelerometerSub && typeof accelerometerSub.remove === 'function') {
        accelerometerSub.remove();
      }
      if (locationHeadingSub && typeof locationHeadingSub.remove === 'function') {
        locationHeadingSub.remove();
      }
    };
  }, [isSimulationMode]);

  const setManualHeading = useCallback((deg: number) => {
    const normalized = ((deg % 360) + 360) % 360;
    setSimulatedHeadingState(normalized);
    setHeading(normalized);
    setRawHeading(normalized);
    currentHeadingRef.current = normalized;
    setIsCalibrating(false);
  }, []);

  const toggleSimulation = useCallback(() => {
    setIsSimulationMode((prev) => {
      const next = !prev;
      if (next) {
        setManualHeading(currentHeadingRef.current);
      }
      return next;
    });
  }, [setManualHeading]);

  return {
    heading: isSimulationMode ? simulatedHeading : heading,
    rawHeading,
    sensorAvailable,
    hasPermission,
    isCalibrating,
    provider: isSimulationMode ? ('Simulazione' as CompassProvider) : provider,
    accuracy,
    sensitivity,
    setSensitivity,
    isSimulationMode,
    setManualHeading,
    toggleSimulation,
  };
}
