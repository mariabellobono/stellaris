import React from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useEventDetail } from '../hooks/useEventDetail';
import { eventDetailStyles as styles } from '../styles/event-detail.styles';

export default function EventDetailScreen() {
  const {
    event,
    isFavorite,
    isObserved,
    calendarLoading,
    formattedDate,
    formattedTime,
    imageUri,
    handleToggleFavorite,
    handleToggleObserved,
    handleAddToCalendar,
  } = useEventDetail();

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Evento non trovato</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: event.title,
          headerBackTitle: 'Eventi',
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Copertina Full-Width */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.imageBadge}>
            <Text style={styles.imageBadgeText}>{event.category}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{event.title}</Text>

          {/* Dati Tecnici Chiave */}
          <View style={styles.techCard}>
            <View style={styles.techRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="time-outline" size={20} color={THEME.colors.accent} />
              </View>
              <View style={styles.techInfo}>
                <Text style={styles.techLabel}>Data e Ora del Picco</Text>
                <Text style={styles.techValue}>
                  {formattedDate} • ore {formattedTime}
                </Text>
              </View>
            </View>

            <View style={styles.techRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="compass-outline" size={20} color={THEME.colors.gold} />
              </View>
              <View style={styles.techInfo}>
                <Text style={styles.techLabel}>Direzione nel Cielo</Text>
                <Text style={styles.techValue}>{event.direction}</Text>
              </View>
            </View>

            <View style={styles.techRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="telescope-outline" size={20} color={THEME.colors.success} />
              </View>
              <View style={styles.techInfo}>
                <Text style={styles.techLabel}>Strumento Consigliato</Text>
                <Text style={styles.techValue}>{event.instrument}</Text>
              </View>
            </View>
          </View>

          {/* Consigli Pratici per l'Osservazione */}
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Ionicons name="sparkles" size={18} color={THEME.colors.gold} />
              <Text style={styles.tipsTitle}>Guida e Consigli per l'Osservazione</Text>
            </View>
            <Text style={styles.tipsText}>{event.description_tips}</Text>
          </View>

          {/* PULSANTI DI AZIONE */}
          <View style={styles.actionsContainer}>
            {/* Salva nei Preferiti */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.actionButton,
                isFavorite && styles.favoriteActiveButton,
              ]}
              onPress={handleToggleFavorite}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? '#FFFFFF' : THEME.colors.accent}
              />
              <Text
                style={[
                  styles.actionButtonText,
                  isFavorite && styles.actionButtonTextActive,
                ]}
              >
                {isFavorite ? 'Salvato nei Preferiti ❤️' : 'Salva nei Preferiti ❤️'}
              </Text>
            </TouchableOpacity>

            {/* L'ho visto! (Badge Osservato) */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.actionButton,
                isObserved && styles.observedActiveButton,
              ]}
              onPress={handleToggleObserved}
            >
              <Ionicons
                name={isObserved ? 'star' : 'star-outline'}
                size={20}
                color={isObserved ? '#FFFFFF' : THEME.colors.gold}
              />
              <Text
                style={[
                  styles.actionButtonText,
                  isObserved && styles.actionButtonTextActive,
                ]}
              >
                {isObserved ? 'Osservato nel Passaporto! 🌟' : 'L\'ho visto! 🌟'}
              </Text>
            </TouchableOpacity>

            {/* Aggiungi al Calendario di Sistema */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.calendarButton}
              onPress={handleAddToCalendar}
              disabled={calendarLoading}
            >
              <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
              <Text style={styles.calendarButtonText}>
                {calendarLoading ? 'Salvataggio...' : 'Aggiungi al Calendario 📅'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
