import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

interface UpdateOverlayProps {
  visible: boolean;
  statusText?: string;
}

export const UpdateOverlay: React.FC<UpdateOverlayProps> = ({
  visible,
  statusText = 'Scaricamento nuova versione in corso...',
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Icona Orbitale con Effetto Glow */}
          <View style={styles.iconCircle}>
            <Ionicons name="rocket-outline" size={38} color={THEME.colors.accent} />
          </View>

          {/* Testo Principale */}
          <Text style={styles.title}>Sto aggiornando Stellaris ✦</Text>
          <Text style={styles.subtitle}>
            È stata rilevata una nuova versione. Stiamo applicando l'aggiornamento...
          </Text>

          {/* Indicatore di Caricamento & Stato */}
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color={THEME.colors.accent} />
            <Text style={styles.statusText}>{statusText}</Text>
          </View>

          {/* Nota Footer */}
          <Text style={styles.footerNote}>
            Appena terminato, l'app si riavvierà automaticamente sulla Home.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 13, 23, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#141724',
    borderRadius: THEME.borderRadius.xl,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(76, 201, 240, 0.3)',
    shadowColor: THEME.colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(76, 201, 240, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(76, 201, 240, 0.25)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  subtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 10,
  },
  footerNote: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 15,
  },
});
