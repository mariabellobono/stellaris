import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { AstroEvent } from '../types';
import { SupabaseService } from '../services/supabase';
import { StorageService } from '../services/storage';

export const EVENT_CATEGORIES = [
  'Tutti',
  'Sciami Meteorici',
  'Eclissi',
  'Congiunzioni',
  'Luna & Pianeti',
  'Asteroidi & Comete',
];

export function useEvents() {
  const router = useRouter();
  const [events, setEvents] = useState<AstroEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tutti');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [observed, setObserved] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadEventsData = useCallback(async () => {
    const [allEvents, favs, obs] = await Promise.all([
      SupabaseService.getEvents(),
      StorageService.getFavorites(),
      StorageService.getObserved(),
    ]);
    setEvents(allEvents);
    setFavorites(favs);
    setObserved(obs);
  }, []);

  useEffect(() => {
    loadEventsData();
  }, [loadEventsData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEventsData();
    setRefreshing(false);
  };

  const handleToggleFavorite = async (eventId: string) => {
    await StorageService.toggleFavorite(eventId);
    const updated = await StorageService.getFavorites();
    setFavorites(updated);
  };

  const filteredEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .filter((ev) => {
        // In Esplora mostriamo solo eventi in programma da oggi in poi
        const isUpcoming = new Date(ev.event_date) >= today;
        if (!isUpcoming) return false;

        const matchSearch =
          ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ev.direction.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ev.description_tips.toLowerCase().includes(searchQuery.toLowerCase());

        const matchCategory =
          selectedCategory === 'Tutti' || ev.category === selectedCategory;

        return matchSearch && matchCategory;
      })
      .sort(
        (a, b) =>
          new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      );
  }, [events, searchQuery, selectedCategory]);

  const handleOpenDetail = (event: AstroEvent) => {
    router.push({
      pathname: '/event-detail',
      params: { eventJson: JSON.stringify(event) },
    });
  };

  return {
    events,
    filteredEvents,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories: EVENT_CATEGORIES,
    favorites,
    observed,
    refreshing,
    onRefresh,
    handleToggleFavorite,
    handleOpenDetail,
  };
}
