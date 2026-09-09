import { StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';
import { WeatherCondition } from '../types';

export const getBadgeColor = (status: WeatherCondition['skyStatus']) => {
  switch (status) {
    case 'Ottimale':
      return THEME.colors.success;
    case 'Buono':
      return '#3A86FF';
    case 'Parzialmente Nuvoloso':
      return THEME.colors.warning;
    case 'Coperto':
      return THEME.colors.accent;
  }
};

export const weatherHeaderStyles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    marginBottom: THEME.spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityText: {
    color: THEME.colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 6,
  },
  loadingBox: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    marginLeft: 10,
  },
  contentRow: {
    marginTop: 4,
  },
  visibilityCard: {},
  visibilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  visibilityLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  visibilityPercent: {
    color: THEME.colors.text,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: THEME.borderRadius.round,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#25293A',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  statsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  footerText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
  },
  boldText: {
    color: THEME.colors.text,
    fontWeight: '600',
  },
});
