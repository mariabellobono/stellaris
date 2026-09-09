import React from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useAstroDex, AstroDexFilterStatus, AstroDexFilterRarity } from '../hooks/useAstroDex';
import { AstroDexCard } from './AstroDexCard';
import { AstroDexCardWithUnlock } from '../types';
import { astroDexStyles as styles, RARITY_COLORS } from '../styles/astro-dex.styles';

interface AstroDexScreenProps {
  userId?: string | null;
  onBack?: () => void;
}

export const AstroDexScreen: React.FC<AstroDexScreenProps> = ({ userId, onBack }) => {
  const {
    cards,
    stats,
    loading,
    refreshing,
    error,
    statusFilter,
    setStatusFilter,
    rarityFilter,
    setRarityFilter,
    searchQuery,
    setSearchQuery,
    selectedCard,
    setSelectedCard,
    unlockingId,
    handleCardPress,
    handleManualUnlock,
    onRefresh,
  } = useAstroDex(userId);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header superiore */}
        <View style={styles.header}>
          {onBack && (
            <TouchableOpacity style={styles.backBtn} onPress={onBack}>
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          <View style={styles.headerTitleGroup}>
            <Text style={styles.headerTitle}>ASTRO-DEX ✦</Text>
            <Text style={styles.headerSubtitle}>
              Collezione Eventi Astronomici Ciclici
            </Text>
          </View>
        </View>

        {/* Card Statistiche Collezione */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <View>
              <Text style={styles.statsLabel}>Progresso Catalogo</Text>
              <Text style={styles.statsCount}>
                {stats.unlocked} <Text style={styles.statsTotal}>/ {stats.total} Carte</Text>
              </Text>
            </View>
            <View style={styles.percentBadge}>
              <Text style={styles.percentText}>{stats.percentage}%</Text>
            </View>
          </View>

          {/* Barra di Avanzamento */}
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.max(5, stats.percentage)}%` },
              ]}
            />
          </View>

          {/* Dettaglio per Rarità */}
          <View style={styles.rarityBreakdown}>
            <View style={styles.rarityItem}>
              <View style={[styles.rarityDot, { backgroundColor: '#06B6D4' }]} />
              <Text style={styles.rarityText}>Comuni: {stats.commonCount}</Text>
            </View>
            <View style={styles.rarityItem}>
              <View style={[styles.rarityDot, { backgroundColor: '#A855F7' }]} />
              <Text style={styles.rarityText}>Rare: {stats.rareCount}</Text>
            </View>
            <View style={styles.rarityItem}>
              <View style={[styles.rarityDot, { backgroundColor: '#FFB703' }]} />
              <Text style={styles.rarityText}>Epiche: {stats.epicCount}</Text>
            </View>
          </View>
        </View>

        {/* Barra di Ricerca */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={THEME.colors.textMuted} />
          <TextInput
            placeholder="Cerca evento, cometa, pianeta..."
            placeholderTextColor={THEME.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={THEME.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filtri Chips */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              statusFilter === 'ALL' && styles.filterChipActive,
            ]}
            onPress={() => setStatusFilter('ALL')}
          >
            <Text
              style={[
                styles.filterChipText,
                statusFilter === 'ALL' && styles.filterChipTextActive,
              ]}
            >
              Tutte
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              statusFilter === 'UNLOCKED' && styles.filterChipActive,
            ]}
            onPress={() => setStatusFilter('UNLOCKED')}
          >
            <Text
              style={[
                styles.filterChipText,
                statusFilter === 'UNLOCKED' && styles.filterChipTextActive,
              ]}
            >
              Sbloccate ({stats.unlocked})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              statusFilter === 'LOCKED' && styles.filterChipActive,
            ]}
            onPress={() => setStatusFilter('LOCKED')}
          >
            <Text
              style={[
                styles.filterChipText,
                statusFilter === 'LOCKED' && styles.filterChipTextActive,
              ]}
            >
              Bloccate ({stats.total - stats.unlocked})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Griglia a 2 colonne */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={THEME.colors.accent} />
            <Text style={styles.loadingText}>Caricamento carte stellari...</Text>
          </View>
        ) : (
          <FlatList
            data={cards}
            numColumns={2}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <AstroDexCard
                card={item}
                onPress={() => handleCardPress(item)}
              />
            )}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrapper}
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
              <View style={styles.emptyContainer}>
                <Ionicons name="telescope-outline" size={48} color={THEME.colors.textMuted} />
                <Text style={styles.emptyTitle}>Nessuna carta trovata</Text>
                <Text style={styles.emptySubtitle}>
                  Prova a modificare i filtri di ricerca o sblocca nuovi eventi osservandoli nel cielo.
                </Text>
              </View>
            }
          />
        )}

        {/* Modal Dettaglio Carta Selezionata */}
        <Modal
          visible={!!selectedCard}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedCard(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedCard && (
                <>
                  <View style={styles.modalHeader}>
                    <View
                      style={[
                        styles.modalRarityBadge,
                        {
                          backgroundColor:
                            RARITY_COLORS[selectedCard.rarity]?.border || '#06B6D4',
                        },
                      ]}
                    >
                      <Text style={styles.modalRarityText}>
                        {RARITY_COLORS[selectedCard.rarity]?.label || 'COMUNE'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.modalCloseBtn}
                      onPress={() => setSelectedCard(null)}
                    >
                      <Ionicons name="close" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>

                  <Image
                    source={{ uri: selectedCard.icon_url }}
                    style={[
                      styles.modalImage,
                      !selectedCard.isUnlocked && styles.modalImageLocked,
                    ]}
                    resizeMode="cover"
                  />

                  <Text style={styles.modalTitle}>{selectedCard.title}</Text>

                  {selectedCard.isUnlocked ? (
                    <>
                      <Text style={styles.modalDescription}>
                        {selectedCard.description}
                      </Text>
                      <View style={styles.modalUnlockBadge}>
                        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                        <Text style={styles.modalUnlockDate}>
                          Sbloccato permanentemente il{' '}
                          {selectedCard.unlockedAt
                            ? new Date(selectedCard.unlockedAt).toLocaleDateString('it-IT', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })
                            : 'oggi'}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <View style={styles.modalLockedBox}>
                      <Ionicons name="lock-closed" size={24} color="#9CA3AF" />
                      <Text style={styles.modalLockedTitle}>Carta Non Ancora Sbloccata</Text>
                      <Text style={styles.modalLockedDesc}>
                        Per scoprire la storia dettagliata e i dati scientifici di questo evento, osservalo nel cielo e segnalalo in app!
                      </Text>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.unlockActionBtn}
                        onPress={() => handleManualUnlock(selectedCard.id)}
                        disabled={unlockingId === selectedCard.id}
                      >
                        {unlockingId === selectedCard.id ? (
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                          <>
                            <Ionicons name="sparkles" size={18} color="#FFFFFF" />
                            <Text style={styles.unlockActionBtnText}>
                              Segna come Osservato (Sblocca)
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

