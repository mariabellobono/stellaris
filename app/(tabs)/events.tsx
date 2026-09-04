import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { THEME } from '../../constants/theme';
import { AstroEvent } from '../../types';
import { SupabaseService } from '../../services/supabase';
import { StorageService } from '../../services/storage';
import { OfflineBanner } from '../../components/OfflineBanner';
import { EventCard } from '../../components/EventCard';

const CATEGORIES = [
  'Tutti',
  'Sciami Meteorici',
  'Eclissi',
  'Congiunzioni',
  'Luna & Pianeti',
];

export default function EventsScreen() {
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
    return events.filter((ev) => {
      const matchSearch =
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.direction.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.description_tips.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === 'Tutti' || ev.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [events, searchQuery, selectedCategory]);

  const handleOpenDetail = (event: AstroEvent) => {
    router.push({
      pathname: '/event-detail',
      params: { eventJson: JSON.stringify(event) },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <OfflineBanner />
      <View style={styles.container}>
        {/* Barra di Ricerca */}
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={18} color={THEME.colors.textSecondary} />
          <TextInput
            placeholder="Cerca sciami, pianeti, eclissi..."
            placeholderTextColor={THEME.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={THEME.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Chip Filtro Orizzontale */}
        <View style={styles.chipsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContainer}
          >
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.chip,
                    active && styles.chipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      active && styles.chipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Lista Eventi */}
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              isFavorite={favorites.includes(item.id)}
              isObserved={observed.includes(item.id)}
              onToggleFavorite={() => handleToggleFavorite(item.id)}
              onPress={() => handleOpenDetail(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={THEME.colors.accent}
              colors={[THEME.colors.accent]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="telescope-outline" size={48} color={THEME.colors.textMuted} />
              <Text style={styles.emptyTitle}>Nessun evento trovato</Text>
              <Text style={styles.emptySubtitle}>
                Prova a modificare il testo di ricerca o la categoria selezionata.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: THEME.spacing.md,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    marginLeft: 10,
  },
  chipsWrapper: {
    marginVertical: 12,
  },
  chipsContainer: {
    paddingRight: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: THEME.colors.accent,
    borderColor: THEME.colors.accent,
  },
  chipText: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  emptySubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 260,
  },
});
