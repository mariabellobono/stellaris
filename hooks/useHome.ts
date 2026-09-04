import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { AstroEvent } from '../types';
import { StorageService } from '../services/storage';
import { SupabaseService } from '../services/supabase';

export function useHome() {
  const router = useRouter();
  const [upcomingEvents, setUpcomingEvents] = useState<AstroEvent[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [observed, setObserved] = useState<string[]>([]);

  const loadData = useCallback(async () => {
    const [events, favs, obs] = await Promise.all([
      SupabaseService.getEvents(),
      StorageService.getFavorites(),
      StorageService.getObserved(),
    ]);

    // Filtra solo gli eventi futuri da oggi in poi (o di stasera)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureEvents = events
      .filter((e) => new Date(e.event_date) >= today)
      .sort(
        (a, b) =>
          new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      );

    setUpcomingEvents(
      futureEvents.length > 0 ? futureEvents.slice(0, 4) : events.slice(0, 4)
    );
    setFavorites(favs);
    setObserved(obs);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleOpenEvent = (event: AstroEvent) => {
    router.push({
      pathname: '/event-detail',
      params: { eventJson: JSON.stringify(event) },
    });
  };

  return {
    upcomingEvents,
    favorites,
    observed,
    refreshing,
    onRefresh,
    handleOpenEvent,
  };
}
