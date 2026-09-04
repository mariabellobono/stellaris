export interface AstroEvent {
  id: string;
  title: string;
  category: 'Sciami Meteorici' | 'Eclissi' | 'Congiunzioni' | 'Luna & Pianeti' | 'Occultazioni' | string;
  event_date: string; // ISO 8601 string
  instrument: string; // es. "Occhio nudo", "Binocolo", "Telescopio"
  direction: string; // es. "Sud-Est", "Nord-Est", "Zenit"
  description_tips: string;
  image_url: string;
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
