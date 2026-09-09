import { StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';

export const eventsStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: THEME.spacing.md,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    marginLeft: 10,
  },
  chipsWrapper: {
    marginVertical: 12,
  },
  chipsContainer: {
    paddingRight: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: THEME.colors.accent,
    borderColor: THEME.colors.accent,
  },
  chipText: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  emptySubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 260,
  },
});

export const eventCardStyles = StyleSheet.create({
  // COMPACT (CAROSELLO HOME)
  compactCard: {
    width: 240,
    height: 180,
    borderRadius: THEME.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: THEME.colors.surface,
    marginRight: 12,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  compactImage: {
    width: '100%',
    height: '100%',
  },
  compactOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(11, 13, 23, 0.90)',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  compactBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  compactTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  compactFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactDate: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginLeft: 4,
  },

  // FULL VERTICAL CARD (TAB ESPLORA)
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  image: {
    width: '100%',
    height: 160,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: 'rgba(230, 57, 70, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(230, 57, 70, 0.3)',
  },
  categoryText: {
    color: THEME.colors.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  observedTag: {
    backgroundColor: 'rgba(255, 183, 3, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 8,
  },
  observedText: {
    color: THEME.colors.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  pastTag: {
    backgroundColor: 'rgba(107, 114, 128, 0.2)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.3)',
  },
  pastText: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '700',
  },
  favButton: {
    padding: 2,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
    lineHeight: 22,
  },
  metaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: '#E0E0E0',
    fontSize: 13,
    marginLeft: 6,
  },
  instrumentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  instrumentText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    marginLeft: 6,
  },
});
