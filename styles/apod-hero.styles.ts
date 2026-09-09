import { StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';

export const apodHeroStyles = StyleSheet.create({
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
