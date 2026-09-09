import React from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { AstroEvent } from '../types';
import { eventCardStyles as styles } from '../styles/events.styles';

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

  const isPast = new Date(event.event_date).getTime() < Date.now();
  const imageUri =
    !event.image_url || event.image_url.includes('1509198397868-475647b2a1e5')
      ? 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
      : event.image_url;

  if (compact) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={styles.compactCard}
      >
        <Image
          source={{ uri: imageUri }}
          style={styles.compactImage}
          resizeMode="cover"
        />
        <View style={styles.compactOverlay}>
          <View style={styles.compactBadgeRow}>
            <Text style={styles.compactTitle} numberOfLines={1}>
              {event.title}
            </Text>
          </View>
          <View style={styles.compactFooter}>
            <Ionicons name="time-outline" size={12} color={THEME.colors.accent} />
            <Text style={styles.compactDate}>{formatDate(event.event_date)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.card}
    >
      <Image
        source={{ uri: imageUri }}
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
                <Text style={styles.observedText}>Osservato 🌟</Text>
              </View>
            )}

            {isPast && (
              <View style={styles.pastTag}>
                <Text style={styles.pastText}>Concluso</Text>
              </View>
            )}

            {onToggleFavorite && (
              <TouchableOpacity
                onPress={onToggleFavorite}
                style={styles.favButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={22}
                  color={isFavorite ? THEME.colors.accent : THEME.colors.textMuted}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

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
