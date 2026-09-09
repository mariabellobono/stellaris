export interface AstroEvent {
  id: string;
  title: string;
  category: 'Sciami Meteorici' | 'Eclissi' | 'Congiunzioni' | 'Luna & Pianeti' | 'Occultazioni' | string;
  event_date: string; // ISO 8601 string
  instrument: string; // es. "Occhio nudo", "Binocolo", "Telescopio"
  direction: string; // es. "Sud-Est", "Nord-Est", "Zenit"
  description_tips: string;
  image_url: string;
  dex_card_id?: string; // ID collegato ad Astro-Dex (opzionale)
}

export interface UserEventState {
  event_id: string;
  is_favorite: boolean;
  is_observed: boolean; // Passaporto astronomico
  updated_at?: string;
}

export interface WeatherCondition {
  city: string;
  temperature: number;
  cloudCover: number; // 0 - 100%
  visibilityPercentage: number; // 100% - cloudCover
  skyStatus: 'Ottimale' | 'Buono' | 'Parzialmente Nuvoloso' | 'Coperto';
  time: string;
  isNightTime: boolean;
}

export interface NasaApod {
  title: string;
  date: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  copyright?: string;
}

export interface IssLocation {
  name: string;
  id: number;
  latitude: number;
  longitude: number;
  altitude: number; // km
  velocity: number; // km/h
  visibility: string;
  timestamp: number;
}

// ==========================================
// 1. TIPI ASTRO-DEX
// ==========================================
export type DexCardRarity = 'COMMON' | 'RARE' | 'EPIC';

export interface DexCard {
  id: string; // es. 'card_perseidi', 'card_iss_pass'
  title: string;
  description: string;
  rarity: DexCardRarity;
  icon_url: string;
  created_at?: string;
}

export interface UserUnlock {
  id: string;
  user_id: string;
  card_id: string;
  unlocked_at: string;
}

export interface AstroDexCardWithUnlock extends DexCard {
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface AstroDexStats {
  total: number;
  unlocked: number;
  percentage: number;
  epicCount: number;
  rareCount: number;
  commonCount: number;
}

// ==========================================
// 2. TIPI BUSSOLA ISS & SENSORI
// ==========================================
export interface DeviceCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number | null;
  heading?: number | null;
}

export interface IssBearingData {
  bearing: number; // 0° - 360° rispetto al Nord geografico
  heading: number; // 0° - 360° orientamento bussola del dispositivo
  rotationAngle: number; // Angolo relativo freccia: (bearing - heading + 360) % 360
  distanceKm: number; // Distanza ortodromica in chilometri
  issAltitudeKm: number; // ~400 km
  isAligned: boolean; // True se |rotationAngle| < 10° o |rotationAngle - 360| < 10°
  issLocation: IssLocation | null;
  userLocation: DeviceCoordinates | null;
  error?: string | null;
}

// ==========================================
// 3. TIPI MAPPA INQUINAMENTO LUMINOSO
// ==========================================
export interface LightPollutionMapConfig {
  tileUrlTemplate: string;
  opacity: number;
  maximumZ: number;
  flipY: boolean;
  zIndex: number;
}

export interface BortleLevelInfo {
  bortleClass: number; // 1 to 9
  title: string;
  description: string;
  color: string;
  nakedEyeLimitingMag: string;
}

