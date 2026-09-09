import { StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';

export const OPACITY_PRESETS = [0.0, 0.35, 0.65, 0.85, 1.0];

export const lightPollutionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070913',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  markerHalo: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(230, 57, 70, 0.35)',
  },
  markerCenter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: THEME.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  overlaySafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  // TOP BAR
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    zIndex: 10,
  },
  circleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(15, 18, 28, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  circleBtnActive: {
    backgroundColor: THEME.colors.gold,
    borderColor: '#FFFFFF',
  },
  topTitleBox: {
    backgroundColor: 'rgba(15, 18, 28, 0.92)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
  },
  topTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  topSubtitle: {
    color: THEME.colors.accent,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 1,
  },

  // FLOATING BUTTONS (SOTTO LA TOPBAR, SENZA SOVRAPPOSIZIONE)
  floatingControlsRight: {
    alignSelf: 'flex-end',
    marginTop: 14,
    gap: 12,
    zIndex: 10,
  },
  actionCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(15, 18, 28, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  actionCircleBtnActive: {
    backgroundColor: THEME.colors.accent,
    borderColor: '#FFFFFF',
  },

  // SPACER PER SPINGERE CONTROLLI IN BASSO
  spacer: {
    flex: 1,
  },

  // OPACITY CONTROLS IN BASSO
  opacityControlContainer: {
    backgroundColor: 'rgba(15, 18, 28, 0.92)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 8,
  },
  opacityHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  opacityLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  opacityLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  zoomHint: {
    color: THEME.colors.gold,
    fontSize: 10,
    fontWeight: '600',
  },
  presetButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  presetBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetBtnActive: {
    backgroundColor: THEME.colors.accent,
  },
  presetBtnText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  presetBtnTextActive: {
    color: '#FFFFFF',
  },

  // LEGENDA BORTLE
  legendContainer: {
    backgroundColor: 'rgba(15, 18, 28, 0.95)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  legendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  gradientBar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  gradientSegment: {
    flex: 1,
  },
  legendLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendLabelGroup: {
    flex: 1,
  },
  darkSkyText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
  },
  pollutedText: {
    color: '#F87171',
    fontSize: 11,
    fontWeight: '700',
  },
  legendSubtext: {
    color: THEME.colors.textMuted,
    fontSize: 9,
    marginTop: 1,
  },
});
