import { IssLocation } from '../../types';

const ISS_API_URL = 'https://api.wheretheiss.at/v1/satellites/25544';

export async function fetchIssLocation(): Promise<IssLocation | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(ISS_API_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        name: data.name || 'ISS (ZARYA)',
        id: data.id || 25544,
        latitude: parseFloat(data.latitude.toFixed(4)),
        longitude: parseFloat(data.longitude.toFixed(4)),
        altitude: Math.round(data.altitude),
        velocity: Math.round(data.velocity),
        visibility: data.visibility || 'daylight',
        timestamp: data.timestamp || Math.floor(Date.now() / 1000),
      };
    }
  } catch (error) {
    console.warn('Errore lettura posizione ISS:', error);
  }
  return null;
}
