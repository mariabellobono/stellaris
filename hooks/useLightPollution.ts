import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { DeviceCoordinates, LightPollutionMapConfig, BortleLevelInfo } from '../types';
import { BORTLE_SCALE_INFO } from '../utils/astroMath';

const DEFAULT_MAP_CONFIG: LightPollutionMapConfig = {
  // Tile layer ad alta risoluzione VIIRS (supporta zoom fino a 16 per mantenere sempre visibili le luci)
  tileUrlTemplate:
    'https://www.lightpollutionmap.info/geoserver/gwc/service/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&LAYER=PostGIS:VIIRS_2022&STYLE=viirs_annual&TILEMATRIXSET=EPSG:900913&TILEMATRIX=EPSG:900913:{z}&TILEROW={y}&TILECOL={x}&FORMAT=image/png',
  opacity: 0.65,
  maximumZ: 16,
  flipY: false,
  zIndex: 2,
};

export function useLightPollution() {
  const [userCoords, setUserCoords] = useState<DeviceCoordinates | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(true);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(true);
  const [layerOpacity, setLayerOpacity] = useState<number>(0.65);
  const [selectedBortle, setSelectedBortle] = useState<BortleLevelInfo>(BORTLE_SCALE_INFO[4]);
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(false);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const [error, setError] = useState<string | null>(null);

  // Default coordinate (Roma / Centro Italia) se il GPS non è disponibile
  const fallbackCoords: DeviceCoordinates = {
    latitude: 41.9028,
    longitude: 12.4964,
  };

  const requestLocation = useCallback(async () => {
    try {
      setLoadingLocation(true);
      setError(null);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setPermissionGranted(false);
        setUserCoords(fallbackCoords);
        return;
      }

      setPermissionGranted(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords: DeviceCoordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude,
      };

      setUserCoords(coords);
    } catch (err) {
      console.warn('Errore lettura geolocalizzazione:', err);
      setUserCoords(fallbackCoords);
      setError('Geolocalizzazione non disponibile. Posizione predefinita impostata.');
    } finally {
      setLoadingLocation(false);
    }
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const [activePresetIndex, setActivePresetIndex] = useState<number>(2); // 0.65 default

  const setOpacityPercent = (percent: number) => {
    const clamped = Math.max(0, Math.min(1, percent));
    setLayerOpacity(clamped);
  };

  const handleSelectOpacityPreset = useCallback((val: number, index: number) => {
    setActivePresetIndex(index);
    setOpacityPercent(val);
  }, []);

  const toggleMapType = useCallback(() => {
    setMapType((prev) => (prev === 'standard' ? 'satellite' : 'standard'));
  }, []);

  return {
    userCoords: userCoords || fallbackCoords,
    loadingLocation,
    permissionGranted,
    layerOpacity,
    setLayerOpacity: setOpacityPercent,
    activePresetIndex,
    handleSelectOpacityPreset,
    mapType,
    toggleMapType,
    tileConfig: {
      ...DEFAULT_MAP_CONFIG,
      opacity: layerOpacity,
    },
    selectedBortle,
    setSelectedBortle,
    isLegendOpen,
    setIsLegendOpen,
    toggleLegend: () => setIsLegendOpen((prev) => !prev),
    refreshLocation: requestLocation,
    error,
  };
}
