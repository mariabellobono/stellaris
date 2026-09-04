import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { THEME } from '../../constants/theme';
import { AstroEvent } from '../../types';
import { StorageService } from '../../services/storage';
import { SupabaseService } from '../../services/supabase';
import { OfflineBanner } from '../../components/OfflineBanner';
import { WeatherHeader } from '../../components/WeatherHeader';
import { ApodHero } from '../../components/ApodHero';
import { IssWidget } from '../../components/IssWidget';
import { EventCard } from '../../components/EventCard';

export default function HomeScreen() {
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

    // Prendi i primi 4 prossimi eventi
    setUpcomingEvents(events.slice(0, 4));
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <OfflineBanner />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={THEME.colors.accent}
            colors={[THEME.colors.accent]}
          />
        }
      >
        {/* 1. HEADER METEO NOTTURNO */}
        <WeatherHeader />

        {/* 2. HERO - FOTO NASA (APOD) */}
        <ApodHero />

        {/* 3. CAROSELLO PROSSIMI EVENTI */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Prossimi Eventi nel Cielo</Text>
          <Text style={styles.sectionSubtitle}>Scorri a lato</Text>
        </View>

        <FlatList
          horizontal
          data={upcomingEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              compact
              isFavorite={favorites.includes(item.id)}
              isObserved={observed.includes(item.id)}
              onPress={() => handleOpenEvent(item)}
            />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
        />

        {/* 4. TRACKER STAZIONE SPAZIALE (ISS) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Tracciamento Satelliti</Text>
        </View>
        <IssWidget />
      </ScrollView>
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
    backgroundColor: THEME.colors.background,
  },
  content: {
    padding: THEME.spacing.md,
    paddingBottom: THEME.spacing.xxl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
  },
  carouselContainer: {
    paddingBottom: 8,
    marginBottom: 16,
  },
});
