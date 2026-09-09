import { IssLocation } from '../../types';

const PRIMARY_ISS_API = 'https://api.wheretheiss.at/v1/satellites/25544';
const SECONDARY_ISS_API = 'http://api.open-notify.org/iss-now.json';

// Cache in memoria dell'ultima posizione valida
let lastKnownLocation: IssLocation = {
  name: 'ISS (ZARYA)',
  id: 25544,
  latitude: 41.89,
  longitude: 12.49,
  altitude: 420,
  velocity: 27600,
  visibility: 'daylight',
  timestamp: Math.floor(Date.now() / 1000),
};
let hasFetchedAtLeastOnce = false;

// Calcolo orbitale approssimato (inclinazione 51.6°, periodo ~92.6 min) in caso di rate-limit o offline
function computeOrbitalPosition(nowSec: number): IssLocation {
  const periodSec = 5560; // 92.66 minuti
  const phase = ((nowSec % periodSec) / periodSec) * 2 * Math.PI;
  const inclinationRad = (51.64 * Math.PI) / 180;

  // Modello sinusoidale di terraferma con rotazione terrestre
  const lat = Math.sin(phase) * (51.64);
  const earthRotationSpeedDegPerSec = 360 / 86400;
  const rawLon = ((nowSec * (360 / periodSec) - nowSec * earthRotationSpeedDegPerSec) % 360) - 180;

  return {
    name: 'ISS (ZARYA)',
    id: 25544,
    latitude: parseFloat(lat.toFixed(4)),
    longitude: parseFloat(rawLon.toFixed(4)),
    altitude: 418,
    velocity: 27580,
    visibility: 'daylight',
    timestamp: nowSec,
  };
}

export async function fetchIssLocation(): Promise<IssLocation> {
  const nowSec = Math.floor(Date.now() / 1000);

  // 1. Prova prima l'API primaria (wheretheiss.at)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(PRIMARY_ISS_API, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      lastKnownLocation = {
        name: data.name || 'ISS (ZARYA)',
        id: data.id || 25544,
        latitude: parseFloat(Number(data.latitude).toFixed(4)),
        longitude: parseFloat(Number(data.longitude).toFixed(4)),
        altitude: Math.round(Number(data.altitude)) || 420,
        velocity: Math.round(Number(data.velocity)) || 27600,
        visibility: data.visibility || 'daylight',
        timestamp: data.timestamp || nowSec,
      };
      hasFetchedAtLeastOnce = true;
      return lastKnownLocation;
    }
  } catch (err) {
    // Prosegui al fallback
  }

  // 2. Fallback su Open-Notify se la primaria è in rate-limit (429) o fallisce
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(SECONDARY_ISS_API, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.iss_position) {
        lastKnownLocation = {
          name: 'ISS (ZARYA)',
          id: 25544,
          latitude: parseFloat(Number(data.iss_position.latitude).toFixed(4)),
          longitude: parseFloat(Number(data.iss_position.longitude).toFixed(4)),
          altitude: 420,
          velocity: 27600,
          visibility: 'daylight',
          timestamp: data.timestamp || nowSec,
        };
        hasFetchedAtLeastOnce = true;
        return lastKnownLocation;
      }
    }
  } catch (err) {
    // Prosegui al fallback deterministico
  }

  // 3. Se entrambe le API sono offline/rate-limitate, proietta in base al modello orbitale
  if (hasFetchedAtLeastOnce) {
    const elapsedSec = nowSec - lastKnownLocation.timestamp;
    if (elapsedSec > 0 && elapsedSec < 3600) {
      // Proiezione breve termine basata su velocità angolare
      const speedDegPerSec = 360 / 5560;
      let newLon = lastKnownLocation.longitude + speedDegPerSec * elapsedSec;
      if (newLon > 180) newLon -= 360;
      lastKnownLocation = {
        ...lastKnownLocation,
        longitude: parseFloat(newLon.toFixed(4)),
        timestamp: nowSec,
      };
      return lastKnownLocation;
    }
  }

  lastKnownLocation = computeOrbitalPosition(nowSec);
  return lastKnownLocation;
}
