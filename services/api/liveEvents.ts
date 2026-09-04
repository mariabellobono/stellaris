import { AstroEvent } from '../../types/index';

// API Ufficiale NASA / JPL (Jet Propulsion Laboratory) - Close Approach Data (CAD)
// Nessun limite di frequenza (No rate limit), dati astronomici reali in tempo reale
const NASA_JPL_CAD_URL =
  'https://ssd-api.jpl.nasa.gov/cad.api?date-min=now&dist-max=25LD&limit=6&sort=date';

function parseJplDate(dateStr: string): string {
  try {
    // Es. "2026-Sep-05 10:11"
    const parsed = new Date(`${dateStr} UTC`);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  } catch {
    // fallback
  }
  return new Date().toISOString();
}

// 1. Recupera asteroidi reali in transito vicino alla Terra da NASA JPL
export async function fetchNasaAsteroids(): Promise<AstroEvent[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(NASA_JPL_CAD_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (!json.data || !Array.isArray(json.data)) return [];

      const asteroidEvents: AstroEvent[] = [];

      for (const row of json.data) {
        const name = row[0]; // es. "2026 RF"
        const dateStr = row[3]; // es. "2026-Sep-05 10:11"
        const distAU = parseFloat(row[4] || '0.01');
        const distKm = Math.round(distAU * 149_597_870);
        const distMln = (distKm / 1_000_000).toFixed(2);
        const speedKmS = parseFloat(row[7] || '10');
        const speedKmH = Math.round(speedKmS * 3600);
        const absMagH = parseFloat(row[10] || '25');

        // Stima approssimativa del diametro dalla magnitudine assoluta H
        const estimatedDiameterM = Math.max(
          10,
          Math.round((1329 / Math.pow(10, absMagH / 5)) * 0.4 * 1000)
        );

        const isoDate = parseJplDate(dateStr);

        asteroidEvents.push({
          id: `nasa-jpl-${name.replace(/\s+/g, '-')}`,
          title: `Transito Asteroide ${name}`,
          category: 'Asteroidi & Comete',
          event_date: isoDate,
          instrument:
            estimatedDiameterM > 100
              ? 'Telescopio (150mm+) / Fotometria'
              : 'Telescopio Digitale / Radar Astronomico',
          direction: `Distanza: ${distMln} Milioni di km (${(distAU * 389).toFixed(1)} Distanze Lunari)`,
          description_tips: `Dati live telemetria NASA JPL: L'asteroide "${name}" (diametro stimato ~${estimatedDiameterM} metri) transita alla velocità di ${speedKmH.toLocaleString()} km/h (${speedKmS.toFixed(1)} km/s). Distanza minima dalla Terra: ${distMln} milioni di km (in totale sicurezza).`,
          image_url:
            'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
        });
      }

      return asteroidEvents;
    }
  } catch (error) {
    console.warn('Impossibile scaricare asteroidi da NASA JPL:', error);
  }
  return [];
}

// 2. Recupera le prossime fasi lunari in tempo reale da Open-Meteo
export async function fetchLiveMoonPhases(): Promise<AstroEvent[]> {
  try {
    const url =
      'https://api.open-meteo.com/v1/forecast?latitude=41.9028&longitude=12.4964&daily=sunrise,sunset,moonrise,moonset,moon_phase&timezone=auto';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const daily = data.daily;
      if (!daily || !daily.time) return [];

      const moonEvents: AstroEvent[] = [];

      for (let i = 0; i < daily.time.length; i++) {
        const dateStr = daily.time[i];
        const phaseVal = daily.moon_phase[i] ?? 0.5;
        const moonrise = daily.moonrise[i]?.split('T')[1] || '21:30';
        const moonset = daily.moonset[i]?.split('T')[1] || '06:00';

        // Fase notevole quando l'illuminazione è >= 85%
        if (phaseVal >= 0.85) {
          const percent = Math.round(phaseVal * 100);
          moonEvents.push({
            id: `moon-phase-${dateStr}`,
            title: `Luna Piena in Avvicinamento (${percent}% Luminosità)`,
            category: 'Luna & Pianeti',
            event_date: `${dateStr}T21:00:00Z`,
            instrument: 'Occhio nudo o Binocolo',
            direction: `Sorge alle ore ${moonrise}, Tramonta alle ore ${moonset}`,
            description_tips: `Dati live Open-Meteo: Il disco lunare raggiunge il ${percent}% di illuminazione. Condizioni eccellenti per osservare mari lunari e il terminatore con un semplice binocolo.`,
            image_url:
              'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=1200&q=80',
          });
          break; // Prendiamo la fase più vicina
        }
      }

      return moonEvents;
    }
  } catch (error) {
    console.warn('Impossibile scaricare dati lunari Open-Meteo:', error);
  }
  return [];
}
