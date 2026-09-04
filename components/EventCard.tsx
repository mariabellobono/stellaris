import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { AstroEvent } from '../types';

interface EventCardProps {
  event: AstroEvent;
  onPress: () => void;
  isFavorite?: boolean;
  isObserved?: boolean;
  onToggleFavorite?: () => void;
  compact?: boolean; // Per carosello orizzontale
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  isFavorite = false,
  isObserved = false,
  onToggleFavorite,
  compact = false,
}) => {
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  if (compact) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={styles.compactCard}
      >
        <Image
          source={{ uri: event.image_url }}
          style={styles.compactImage}
          resizeMode="cover"
        />
        <View style={styles.compactOverlay}>
          <View style={styles.compactBadgeRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
            {isObserved && (
              <View style={styles.observedTag}>
                <Text style={styles.observedText}>🌟 Visto</Text>
              </View>
            )}
          </View>
          <Text style={styles.compactTitle} numberOfLines={2}>
            {event.title}
          </Text>
          <View style={styles.compactFooter}>
            <Ionicons name="time-outline" size={12} color={THEME.colors.textSecondary} />
            <Text style={styles.compactDate}>{formatDate(event.event_date)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={styles.card}
    >
      <Image
        source={{ uri: event.image_url }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
          <View style={styles.actionRow}>
            {isObserved && (
              <View style={styles.observedTag}>
                <Text style={styles.observedText}>🌟 Visto</Text>
              </View>
            )}
            {onToggleFavorite && (
              <TouchableOpacity
                onPress={onToggleFavorite}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.favButton}
              >
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={22}
                  color={isFavorite ? THEME.colors.accent : THEME.colors.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text style={styles.title}>{event.title}</Text>

        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color={THEME.colors.accent} />
            <Text style={styles.metaText}>{formatDate(event.event_date)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="compass-outline" size={14} color={THEME.colors.gold} />
            <Text style={styles.metaText}>{event.direction}</Text>
          </View>
        </View>

        <View style={styles.instrumentRow}>
          <Ionicons name="eye-outline" size={14} color={THEME.colors.textSecondary} />
          <Text style={styles.instrumentText}>Strumento: {event.instrument}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // COMPACT (CAROSELLO HOME)
  compactCard: {
    width: 240,
    height: 180,
    borderRadius: THEME.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: THEME.colors.surface,
    marginRight: 12,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  compactImage: {
    width: '100%',
    height: '100%',
  },
  compactOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(11, 13, 23, 0.90)',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  compactBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  compactTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  compactFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactDate: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginLeft: 4,
  },

  // FULL VERTICAL CARD (TAB ESPLORA)
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  image: {
    width: '100%',
    height: 160,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: 'rgba(230, 57, 70, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(230, 57, 70, 0.3)',
  },
  categoryText: {
    color: THEME.colors.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  observedTag: {
    backgroundColor: 'rgba(255, 183, 3, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 8,
  },
  observedText: {
    color: THEME.colors.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  favButton: {
    padding: 2,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
    lineHeight: 22,
  },
  metaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: '#E0E0E0',
    fontSize: 13,
    marginLeft: 6,
  },
  instrumentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  instrumentText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    marginLeft: 6,
  },
});
