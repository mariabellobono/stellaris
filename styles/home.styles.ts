import { StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';

export const homeStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  content: {
    padding: THEME.spacing.md,
    paddingBottom: THEME.spacing.xxl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
  },
  carouselContainer: {
    paddingBottom: 8,
    marginBottom: 16,
  },
});
