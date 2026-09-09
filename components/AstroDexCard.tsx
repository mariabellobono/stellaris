import React from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AstroDexCardWithUnlock } from '../types';
import { astroDexCardStyles as styles, RARITY_COLORS } from '../styles/astro-dex.styles';

interface AstroDexCardProps {
  card: AstroDexCardWithUnlock;
  onPress: () => void;
  onUnlockPress?: () => void;
}

export const AstroDexCard: React.FC<AstroDexCardProps> = ({
  card,
  onPress,
  onUnlockPress,
}) => {
  const { isUnlocked, rarity, title, description, icon_url, unlockedAt } = card;
  const rarityConfig = RARITY_COLORS[rarity] || RARITY_COLORS.COMMON;

  const formattedDate = unlockedAt
    ? new Date(unlockedAt).toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.cardContainer,
        isUnlocked
          ? {
              borderColor: rarityConfig.border,
              shadowColor: rarityConfig.border,
              shadowOpacity: 0.35,
              shadowRadius: 8,
              elevation: 5,
            }
          : styles.lockedBorder,
      ]}
    >
      {/* Container Immagine */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: icon_url }}
          style={[
            styles.image,
            !isUnlocked && styles.lockedImage,
          ]}
          resizeMode="cover"
        />

        {/* Badge Rarità in alto a sinistra */}
        <View
          style={[
            styles.rarityBadge,
            { backgroundColor: isUnlocked ? rarityConfig.border : '#374151' },
          ]}
        >
          <Text style={styles.rarityBadgeText}>
            {rarityConfig.label}
          </Text>
        </View>

        {/* Lucchetto o Badge Sbloccato in alto a destra */}
        <View style={styles.statusBadge}>
          {isUnlocked ? (
            <Ionicons name="sparkles" size={14} color="#FFB703" />
          ) : (
            <Ionicons name="lock-closed" size={14} color="#9CA3AF" />
          )}
        </View>
      </View>

      {/* Contenuto Testuale */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {/* Descrizione: in chiaro se unlocked, oscurata se locked */}
        {isUnlocked ? (
          <Text style={styles.description} numberOfLines={3}>
            {description}
          </Text>
        ) : (
          <View style={styles.obscuredContainer}>
            <Text style={styles.obscuredText} numberOfLines={2}>
              Osserva questo evento celeste per rivelare i segreti della carta.
            </Text>
          </View>
        )}

        {/* Footer: Data sblocco oppure Bottone rapido sblocco */}
        <View style={styles.footer}>
          {isUnlocked ? (
            <View style={styles.unlockedFooter}>
              <Ionicons name="checkmark-circle" size={13} color="#10B981" />
              <Text style={styles.unlockedDateText}>
                Sbloccato il: {formattedDate}
              </Text>
            </View>
          ) : (
            <View style={styles.lockedFooter}>
              <Ionicons name="eye-outline" size={13} color="#9CA3AF" />
              <Text style={styles.lockedText}>Da sbloccare</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

