import React from 'react';
import {
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
import { THEME } from '../../constants/theme';
import { OfflineBanner } from '../../components/OfflineBanner';
import { EventCard } from '../../components/EventCard';
import { useEvents } from '../../hooks/useEvents';
import { eventsStyles as styles } from '../../styles/events.styles';

export default function EventsScreen() {
  const {
    filteredEvents,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    favorites,
    observed,
    refreshing,
    onRefresh,
    handleToggleFavorite,
    handleOpenDetail,
  } = useEvents();

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
            {categories.map((cat) => {
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
