import { AstroEvent } from '../types';

// Nessun preset fisso: tutti gli eventi vengono caricati in tempo reale dalle API (NASA, Open-Meteo) e da Supabase
export const INITIAL_ASTRONOMICAL_EVENTS: AstroEvent[] = [];
