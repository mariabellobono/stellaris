import React from 'react';
import {
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
import { useApodHero } from '../hooks/useApodHero';
import { apodHeroStyles as styles } from '../styles/apod-hero.styles';

export const ApodHero: React.FC = () => {
  const { apod, loading, modalVisible, setModalVisible } = useApodHero();

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
