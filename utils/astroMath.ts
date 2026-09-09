import type { BortleLevelInfo } from '../types';

/**
 * Converte gradi in radianti
 */
export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Converte radianti in gradi
 */
export function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Normalizza un angolo nell'intervallo [0, 360)
 */
export function normalizeAngle(angle: number): number {
  const normalized = angle % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

/**
 * Calcola la minima differenza angolare con segno tra due angoli [-180, 180]
 */
export function getShortestAngleDiff(target: number, current: number): number {
  const diff = ((target - current + 180) % 360 + 360) % 360 - 180;
  return diff;
}

/**
 * Calcola il Bearing (Azimuth iniziale su sfera ortodromica)
 * tra coordinate Utente (lat1, lon1) e coordinate ISS (lat2, lon2).
 * 
 * Formula:
 * Δλ = λ2 - λ1
 * y = sin(Δλ) * cos(φ2)
 * x = cos(φ1) * sin(φ2) - sin(φ1) * cos(φ2) * cos(Δλ)
 * bearing = (atan2(y, x) * 180 / π + 360) % 360
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const deltaLambda = toRadians(lon2 - lon1);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return normalizeAngle(bearing);
}

/**
 * Calcola la distanza tra due punti geografici con la formula di Haversine (in km).
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Raggio medio della Terra in chilometri
  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const deltaPhi = toRadians(lat2 - lat1);
  const deltaLambda = toRadians(lon2 - lon1);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Calcola l'angolo di rotazione relativo della freccia rispetto all'orientamento del telefono:
 * rotationAngle = (bearing - heading + 360) % 360
 */
export function calculateRotationAngle(bearing: number, heading: number): number {
  return normalizeAngle(bearing - heading);
}

/**
 * Determina se il dispositivo è allineato fisicamente verso il bersaglio (tolleranza ±10°)
 */
export function isAngleAligned(rotationAngle: number, toleranceDeg: number = 10): boolean {
  const normalized = normalizeAngle(rotationAngle);
  return normalized <= toleranceDeg || normalized >= 360 - toleranceDeg;
}

/**
 * Filtro passa-basso (Low-Pass Filter) circolare per stabilizzare le oscillazioni
 * dei sensori magnetici senza salti quando si attraversa lo 0°/360°.
 * 
 * @param previousAngle Angolo precedente [0, 360)
 * @param newAngle Nuovo angolo letto dal sensore [0, 360)
 * @param alpha Fattore di smoothing (es. 0.15: più basso = più fluido/inerziale, più alto = più reattivo)
 */
export function lowPassFilterAngle(
  previousAngle: number,
  newAngle: number,
  alpha: number = 0.18
): number {
  const diff = getShortestAngleDiff(newAngle, previousAngle);
  return normalizeAngle(previousAngle + alpha * diff);
}

/**
 * Filtro adattivo ad alta sensibilità per bussola:
 * - Elimina il tremolio/rumore da fermo (deadband minima)
 * - Risposta istantanea e scattante alle rotazioni della mano
 */
export function adaptiveSmoothAngle(
  previousAngle: number,
  newAngle: number,
  sensitivity: 'HIGH' | 'NORMAL' | 'SMOOTH' = 'HIGH'
): number {
  const diff = getShortestAngleDiff(newAngle, previousAngle);
  const absDiff = Math.abs(diff);

  // Micro-deadband per bloccare le fluttuazioni minime da fermo
  const deadband = sensitivity === 'HIGH' ? 0.25 : sensitivity === 'NORMAL' ? 0.4 : 0.6;
  if (absDiff < deadband) {
    return previousAngle;
  }

  let alpha = 0.55;
  if (sensitivity === 'HIGH') {
    if (absDiff > 6) alpha = 0.95;
    else if (absDiff > 2) alpha = 0.75;
    else alpha = 0.55;
  } else if (sensitivity === 'NORMAL') {
    if (absDiff > 8) alpha = 0.85;
    else if (absDiff > 3) alpha = 0.6;
    else alpha = 0.4;
  } else {
    // SMOOTH
    if (absDiff > 10) alpha = 0.75;
    else if (absDiff > 4) alpha = 0.45;
    else alpha = 0.25;
  }

  return normalizeAngle(previousAngle + alpha * diff);
}


/**
 * Converte i dati del magnetometro (x, y) in gradi di rotta bussola [0, 360)
 * 0° = Nord, 90° = Est, 180° = Sud, 270° = Ovest
 */
export function magnetometerToHeading(x: number, y: number): number {
  // Sul sistema assi del telefono (X=destra, Y=in alto), il vettore magnetico
  // verso il Nord si proietta con un angolo rispetto all'asse Y pari a atan2(-x, y).
  const heading = (Math.atan2(-x, y) * 180) / Math.PI;
  return Math.round(normalizeAngle(heading) * 10) / 10;
}

/**
 * Proiezione vettoriale 3D per calcolare l'orientamento bussola [0, 360)
 * con compensazione completa del tilt (Pitch & Roll).
 *
 * Utilizza il vettore accelerazione/gravità (ax, ay, az) per individuare il vettore Zenith (Up)
 * e proietta il vettore magnetico (mx, my, mz) sul piano orizzontale terrestre.
 * Risolve definitivamente il tilt error e le inversioni di asse su iOS e Android.
 */
export function calculateTiltCompensatedHeading(
  mx: number,
  my: number,
  mz: number,
  ax: number,
  ay: number,
  az: number,
  isIos: boolean = true
): number {
  const normA = Math.hypot(ax, ay, az);
  if (normA === 0) {
    return magnetometerToHeading(mx, my);
  }

  // Su iOS lo schermo verso l'alto a riposo legge az = -1.0g (gravità verso il basso),
  // quindi il vettore Zenith (Up) è -a.
  // Su Android a riposo az = +1.0g (forza normale verso l'alto), quindi l'Up è +a.
  const sign = isIos ? -1 : 1;
  const ux = (sign * ax) / normA;
  const uy = (sign * ay) / normA;
  const uz = (sign * az) / normA;

  // Proiezione del campo magnetico sul piano orizzontale:
  // m_H = m - (m · u) * u
  const mDotU = mx * ux + my * uy + mz * uz;
  const mHx = mx - mDotU * ux;
  const mHy = my - mDotU * uy;
  const mHz = mz - mDotU * uz;

  const normMH = Math.hypot(mHx, mHy, mHz);
  if (normMH === 0) {
    return magnetometerToHeading(mx, my);
  }

  // Vettore unitario Nord orizzontale
  const nx = mHx / normMH;
  const ny = mHy / normMH;
  const nz = mHz / normMH;

  // Vettore unitario Est orizzontale = Nord x Up
  const ex = ny * uz - nz * uy;
  const ey = nz * ux - nx * uz;
  const ez = nx * uy - ny * ux;

  // Vettore di puntamento del telefono (+Y: cima dello schermo)
  // Proiezione sul piano orizzontale: T_H = T - (T · u) * u  (dove T = [0, 1, 0] -> T · u = uy)
  const tDotU = uy;
  const tx = -tDotU * ux;
  const ty = 1 - tDotU * uy;
  const tz = -tDotU * uz;

  const normT = Math.hypot(tx, ty, tz);
  if (normT === 0) {
    return magnetometerToHeading(mx, my);
  }

  const fx = tx / normT;
  const fy = ty / normT;
  const fz = tz / normT;

  // Componenti avanti proiettate su Nord ed Est
  const projN = fx * nx + fy * ny + fz * nz;
  const projE = fx * ex + fy * ey + fz * ez;

  // Angolo orario dal Nord: atan2(Est, Nord)
  const headingRad = Math.atan2(projE, projN);
  const headingDeg = (headingRad * 180) / Math.PI;

  return Math.round(normalizeAngle(headingDeg) * 10) / 10;
}

/**
 * Converte un angolo in gradi nel corrispondente codice cardinale breve (es. 'N', 'NE', 'E')
 */
export function degreesToShortCardinal(deg: number): string {
  const normalized = normalizeAngle(deg);
  const cardinals = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSO',
    'SO',
    'OSO',
    'O',
    'ONO',
    'NO',
    'NNO',
  ];
  const index = Math.round(normalized / 22.5) % 16;
  return cardinals[index];
}

/**
 * Converte un angolo in gradi nel corrispondente punto cardinale testuale completo
 */
export function degreesToCardinal(deg: number): string {
  const normalized = normalizeAngle(deg);
  const cardinals = [
    'Nord (N)',
    'Nord-Nord-Est (NNE)',
    'Nord-Est (NE)',
    'Est-Nord-Est (ENE)',
    'Est (E)',
    'Est-Sud-Est (ESE)',
    'Sud-Est (SE)',
    'Sud-Sud-Est (SSE)',
    'Sud (S)',
    'Sud-Sud-Ovest (SSO)',
    'Sud-Ovest (SO)',
    'Ovest-Sud-Ovest (OSO)',
    'Ovest (O)',
    'Ovest-Nord-Ovest (ONO)',
    'Nord-Ovest (NO)',
    'Nord-Nord-Ovest (NNO)',
  ];
  const index = Math.round(normalized / 22.5) % 16;
  return cardinals[index];
}

/**
 * Calcola l'istruzione di rotazione pratica per l'utente ("Gira a destra di X°" o "Allineato")
 */
export function getTurnGuidance(relativeAngle: number): {
  aligned: boolean;
  text: string;
  diffDeg: number;
  direction: 'center' | 'right' | 'left';
} {
  const norm = normalizeAngle(relativeAngle);
  if (norm <= 10 || norm >= 350) {
    return {
      aligned: true,
      text: 'Stai guardando verso la ISS! 🛰️',
      diffDeg: 0,
      direction: 'center',
    };
  } else if (norm < 180) {
    const diff = Math.round(norm);
    return {
      aligned: false,
      text: `Ruota a destra di ${diff}°`,
      diffDeg: diff,
      direction: 'right',
    };
  } else {
    const diff = Math.round(360 - norm);
    return {
      aligned: false,
      text: `Ruota a sinistra di ${diff}°`,
      diffDeg: diff,
      direction: 'left',
    };
  }
}


/**
 * Definizioni e colori standard della scala di Bortle per l'inquinamento luminoso
 */
export const BORTLE_SCALE_INFO: Record<number, BortleLevelInfo> = {
  1: {
    bortleClass: 1,
    title: 'Cielo Buio Eccellente',
    description: 'Nessun inquinamento luminoso. Luce zodiacale evidente, galassia M33 visibile a occhio nudo.',
    color: '#0D1B2A',
    nakedEyeLimitingMag: '7.6 - 8.0',
  },
  2: {
    bortleClass: 2,
    title: 'Cielo Buio Tipico',
    description: 'Via Lattea ricca di dettagli e ombre visibili. Scarsa luminescenza all’orizzonte.',
    color: '#1B263B',
    nakedEyeLimitingMag: '7.1 - 7.5',
  },
  3: {
    bortleClass: 3,
    title: 'Cielo Rurale',
    description: 'Qualche segno di inquinamento luminoso all’orizzonte. Via Lattea ancora spettacolare.',
    color: '#1D4ED8',
    nakedEyeLimitingMag: '6.6 - 7.0',
  },
  4: {
    bortleClass: 4,
    title: 'Transizione Rurale/Suburbana',
    description: 'Cupole di luce visibili in varie direzioni. La Via Lattea perde contrasto verso l’orizzonte.',
    color: '#059669',
    nakedEyeLimitingMag: '6.1 - 6.5',
  },
  5: {
    bortleClass: 5,
    title: 'Cielo Suburbano',
    description: 'Inquinamento luminoso evidente in quasi tutte le direzioni. Via Lattea debole allo zenit.',
    color: '#D97706',
    nakedEyeLimitingMag: '5.6 - 6.0',
  },
  6: {
    bortleClass: 6,
    title: 'Cielo Suburbano Luminoso',
    description: 'Via Lattea visibile solo allo zenit. Il cielo assume una tinta grigio-biancastra.',
    color: '#EA580C',
    nakedEyeLimitingMag: '5.1 - 5.5',
  },
  7: {
    bortleClass: 7,
    title: 'Transizione Suburbana/Urbana',
    description: 'Via Lattea invisibile. L’intero sfondo del cielo è chiaro anche a notte fonda.',
    color: '#DC2626',
    nakedEyeLimitingMag: '4.6 - 5.0',
  },
  8: {
    bortleClass: 8,
    title: 'Cielo Urbano',
    description: 'Visibili solo la Luna, i pianeti luminosi e le stelle principali delle costellazioni.',
    color: '#991B1B',
    nakedEyeLimitingMag: '4.1 - 4.5',
  },
  9: {
    bortleClass: 9,
    title: 'Cielo del Centro Urbano',
    description: 'Forte bagliore cittadino. Molte costellazioni sono indistinguibili a occhio nudo.',
    color: '#7F1D1D',
    nakedEyeLimitingMag: '< 4.0',
  },
};
