import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { NasaApod } from '../types';
import { fetchNasaApod } from '../services/api/nasa';

export const ApodHero: React.FC = () => {
  const [apod, setApod] = useState<NasaApod | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchNasaApod()
      .then((data) => setApod(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>FOTO DEL GIORNO • NASA APOD</Text>
        </View>
        <Text style={styles.dateText}>{apod?.date || ''}</Text>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color={THEME.colors.accent} />
          <Text style={styles.loadingText}>Caricamento immagine cosmica...</Text>
        </View>
      ) : apod ? (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.card}
          onPress={() => setModalVisible(true)}
        >
          <Image
            source={{ uri: apod.url }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.overlay}>
            <Text style={styles.title} numberOfLines={2}>
              {apod.title}
            </Text>
            <View style={styles.readMoreRow}>
              <Text style={styles.readMoreText}>Tocca per la spiegazione scientifica</Text>
              <Ionicons name="chevron-forward" size={14} color={THEME.colors.gold} />
            </View>
          </View>
        </TouchableOpacity>
      ) : null}

      {/* Modal Spiegazione Scientifica */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>ASTRONOMY PICTURE OF THE DAY</Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollBody}
            >
              {apod && (
                <>
                  <Image
                    source={{ uri: apod.hdurl || apod.url }}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.modalTitle}>{apod.title}</Text>
                  <Text style={styles.modalDate}>Data NASA: {apod.date}</Text>

                  {apod.copyright && (
                    <Text style={styles.modalCopyright}>
                      © Crediti: {apod.copyright}
                    </Text>
                  )}

                  <View style={styles.divider} />

                  <Text style={styles.modalExplanationTitle}>
                    Spiegazione dell'Astrofisico:
                  </Text>
                  <Text style={styles.modalExplanation}>
                    {apod.explanation}
                  </Text>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: THEME.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: 'rgba(230, 57, 70, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(230, 57, 70, 0.3)',
  },
  badgeText: {
    color: THEME.colors.accent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  dateText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
  },
  loadingBox: {
    height: 180,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  loadingText: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    marginTop: 8,
  },
  card: {
    height: 220,
    borderRadius: THEME.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(11, 13, 23, 0.88)',
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  readMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    color: THEME.colors.gold,
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: THEME.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.surfaceBorder,
  },
  closeButton: {
    padding: 4,
  },
  scrollBody: {
    padding: 20,
    paddingBottom: 40,
  },
  modalImage: {
    width: '100%',
    height: 260,
    borderRadius: 16,
    marginBottom: 16,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 8,
  },
  modalDate: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
  },
  modalCopyright: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.surfaceBorder,
    marginVertical: 16,
  },
  modalExplanationTitle: {
    color: THEME.colors.gold,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalExplanation: {
    color: '#E0E0E0',
    fontSize: 14,
    lineHeight: 24,
  },
});
