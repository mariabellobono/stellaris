import { useState, useEffect, useCallback, useRef } from 'react';
import { IssLocation } from '../types';
import { fetchIssLocation } from '../services/api/iss';

const POLL_INTERVAL_MS = 10000; // 10 secondi per rispettare i rate limit

export function useISSLocation() {
  const [issLocation, setIssLocation] = useState<IssLocation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchLocation = useCallback(async (isInitial: boolean = false) => {
    try {
      if (isInitial) setLoading(true);
      const data = await fetchIssLocation();
      if (data) {
        setIssLocation(data);
        setLastUpdated(Date.now());
        setError(null);
      }
    } catch (err: any) {
      console.warn('Errore nel polling della ISS:', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation(true);

    intervalRef.current = setInterval(() => {
      fetchLocation(false);
    }, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchLocation]);

  return {
    issLocation,
    loading,
    error,
    lastUpdated,
    refetch: () => fetchLocation(false),
  };
}
