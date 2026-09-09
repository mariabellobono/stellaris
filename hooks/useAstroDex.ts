import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { AstroDexCardWithUnlock, AstroDexStats, DexCardRarity } from '../types';
import { SupabaseService } from '../services/supabase';
import { StorageService } from '../services/storage';

export type AstroDexFilterStatus = 'ALL' | 'UNLOCKED' | 'LOCKED';
export type AstroDexFilterRarity = 'ALL' | DexCardRarity;

export function useAstroDex(userId?: string | null) {
  const [cards, setCards] = useState<AstroDexCardWithUnlock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<AstroDexFilterStatus>('ALL');
  const [rarityFilter, setRarityFilter] = useState<AstroDexFilterRarity>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Caricamento unificato di carte e sblocchi
  const fetchDexData = useCallback(async () => {
    try {
      setError(null);
      const [allCards, userUnlocks] = await Promise.all([
        SupabaseService.getDexCards(),
        SupabaseService.getUserUnlocks(userId || ''),
      ]);

      const unlockMap = new Map<string, string>();
      userUnlocks.forEach((u) => {
        unlockMap.set(u.card_id, u.unlocked_at);
      });

      const mergedCards: AstroDexCardWithUnlock[] = allCards.map((card) => {
        const isUnlocked = unlockMap.has(card.id);
        return {
          ...card,
          isUnlocked,
          unlockedAt: unlockMap.get(card.id),
        };
      });

      setCards(mergedCards);
    } catch (err: any) {
      console.error('Errore caricamento Astro-Dex:', err);
      setError('Impossibile caricare il catalogo Astro-Dex.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDexData();
  }, [fetchDexData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDexData();
  }, [fetchDexData]);

  /**
   * Sblocco ottimistico di una carta:
   * Aggiorna immediatamente lo stato locale (per feedback visivo istantaneo),
   * e se la sincronizzazione fallisce, effettua il rollback.
   */
  const unlockCard = useCallback(
    async (cardId: string): Promise<boolean> => {
      // 1. Salva stato precedente per eventuale rollback
      const previousCards = [...cards];

      // 2. Mutazione ottimistica immediata
      setCards((prev) =>
        prev.map((c) =>
          c.id === cardId
            ? { ...c, isUnlocked: true, unlockedAt: new Date().toISOString() }
            : c
        )
      );

      try {
        const success = await SupabaseService.unlockCard(userId || null, cardId);
        if (!success) {
          // Rollback se il servizio segnala fallimento critico
          console.warn('Sync fallito, eseguo rollback per cardId:', cardId);
          setCards(previousCards);
          return false;
        }
        return true;
      } catch (err) {
        console.error('Eccezione durante unlockCard, rollback:', err);
        setCards(previousCards);
        return false;
      }
    },
    [cards, userId]
  );

  // Calcolo statistiche collezione
  const stats: AstroDexStats = useMemo(() => {
    const total = cards.length;
    const unlocked = cards.filter((c) => c.isUnlocked).length;
    const percentage = total > 0 ? Math.round((unlocked / total) * 100) : 0;
    const epicCount = cards.filter((c) => c.rarity === 'EPIC' && c.isUnlocked).length;
    const rareCount = cards.filter((c) => c.rarity === 'RARE' && c.isUnlocked).length;
    const commonCount = cards.filter((c) => c.rarity === 'COMMON' && c.isUnlocked).length;

    return {
      total,
      unlocked,
      percentage,
      epicCount,
      rareCount,
      commonCount,
    };
  }, [cards]);

  // Filtraggio e ricerca
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      // Filtro stato
      if (statusFilter === 'UNLOCKED' && !card.isUnlocked) return false;
      if (statusFilter === 'LOCKED' && card.isUnlocked) return false;

      // Filtro rarità
      if (rarityFilter !== 'ALL' && card.rarity !== rarityFilter) return false;

      // Filtro ricerca testuale
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = card.title.toLowerCase().includes(query);
        const matchDesc = card.description.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc) return false;
      }

      return true;
    });
  }, [cards, statusFilter, rarityFilter, searchQuery]);

  const [selectedCard, setSelectedCard] = useState<AstroDexCardWithUnlock | null>(null);
  const [unlockingId, setUnlockingId] = useState<string | null>(null);

  const handleCardPress = useCallback((card: AstroDexCardWithUnlock) => {
    setSelectedCard(card);
  }, []);

  const handleManualUnlock = useCallback(
    async (cardId: string) => {
      try {
        setUnlockingId(cardId);
        const success = await unlockCard(cardId);
        if (success) {
          Alert.alert(
            'Carta Sbloccata! 🌟',
            'Hai aggiunto questa preziosa carta astronomica alla tua collezione permanente!'
          );
          setSelectedCard((prev) =>
            prev && prev.id === cardId
              ? { ...prev, isUnlocked: true, unlockedAt: new Date().toISOString() }
              : prev
          );
        } else {
          Alert.alert('Attenzione', 'Impossibile sbloccare la carta al momento.');
        }
      } finally {
        setUnlockingId(null);
      }
    },
    [unlockCard]
  );

  return {
    cards: filteredCards,
    allCards: cards,
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
    unlockCard,
  };
}
