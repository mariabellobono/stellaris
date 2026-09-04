import { StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';

export const profileStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: THEME.spacing.md,
  },

  // --- USER CARD ---
  userCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: 16,
    marginTop: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E2333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  userStatus: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  authToggleBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  authToggleText: {
    color: THEME.colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },

  // --- AUTH FORM ---
  authForm: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.surfaceBorder,
  },
  authFormTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#141724',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  submitBtn: {
    backgroundColor: THEME.colors.accent,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: THEME.colors.surfaceBorder,
  },
  dividerText: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    marginHorizontal: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 11,
    gap: 8,
  },
  googleBtnText: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '700',
  },
  switchModeBtn: {
    marginTop: 12,
    alignItems: 'center',
  },
  switchModeText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
  },

  // --- STATS ROW ---
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.surfaceBorder,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: THEME.colors.surfaceBorder,
  },

  // --- TABS SWITCHER ---
  tabsSwitcher: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  tabSwitchItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabSwitchItemActive: {
    backgroundColor: '#1E2333',
  },
  tabSwitchText: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  tabSwitchTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // --- LIST & EMPTY STATE ---
  listContent: {
    paddingBottom: 24,
  },
  emptyState: {
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 260,
    lineHeight: 18,
  },
});
