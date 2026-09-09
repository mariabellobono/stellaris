import { StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';

export const eventDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  imageContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(11, 13, 23, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  imageBadgeText: {
    color: THEME.colors.accent,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  body: {
    padding: THEME.spacing.md,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: 16,
  },
  techCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  techRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E2333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  techInfo: {
    flex: 1,
  },
  techLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    marginBottom: 2,
  },
  techValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  tipsCard: {
    backgroundColor: 'rgba(255, 183, 3, 0.06)',
    borderRadius: THEME.borderRadius.lg,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 183, 3, 0.25)',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipsTitle: {
    color: THEME.colors.gold,
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  tipsText: {
    color: '#E0E0E0',
    fontSize: 14,
    lineHeight: 22,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  favoriteActiveButton: {
    backgroundColor: THEME.colors.accent,
    borderColor: THEME.colors.accent,
  },
  observedActiveButton: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 10,
  },
  actionButtonTextActive: {
    color: '#FFFFFF',
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D3557',
    borderRadius: THEME.borderRadius.md,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#457B9D',
  },
  calendarButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 10,
  },
});
