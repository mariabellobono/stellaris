import React from 'react';
import {
  Text,
  View,
  ScrollView,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from '../../constants/theme';
import { OfflineBanner } from '../../components/OfflineBanner';
import { WeatherHeader } from '../../components/WeatherHeader';
import { ApodHero } from '../../components/ApodHero';
import { IssWidget } from '../../components/IssWidget';
import { EventCard } from '../../components/EventCard';
import { useHome } from '../../hooks/useHome';
import { homeStyles as styles } from '../../styles/home.styles';

export default function HomeScreen() {
  const {
    upcomingEvents,
    favorites,
    observed,
    refreshing,
    onRefresh,
    handleOpenEvent,
  } = useHome();

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
