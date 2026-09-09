import { StyleSheet, Dimensions } from 'react-native';
import { THEME } from '../constants/theme';

const { width } = Dimensions.get('window');
export const COMPASS_SIZE = Math.min(width - 64, 290);

export const CARDINAL_POINTS = [
  { deg: 0, label: 'N', isMajor: true, color: '#EF4444' },
  { deg: 45, label: 'NE', isMajor: false },
  { deg: 90, label: 'E', isMajor: true, color: '#FFFFFF' },
  { deg: 135, label: 'SE', isMajor: false },
  { deg: 180, label: 'S', isMajor: true, color: '#FFFFFF' },
  { deg: 225, label: 'SO', isMajor: false },
  { deg: 270, label: 'O', isMajor: true, color: '#FFFFFF' },
  { deg: 315, label: 'NO', isMajor: false },
];

export const TICKS = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

export const issCompassStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#070913',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  headerTitleGroup: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  headerSubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    marginTop: 1,
  },
  simToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 183, 3, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 183, 3, 0.3)',
    gap: 4,
  },
  simToggleBtnActive: {
    backgroundColor: '#EAB308',
    borderColor: '#FACC15',
  },
  simToggleText: {
    color: THEME.colors.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  simToggleTextActive: {
    color: '#0B0D17',
  },

  // GUIDANCE BANNER
  guidanceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    gap: 12,
  },
  guidanceBannerAligned: {
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    borderColor: '#10B981',
  },
  guidanceBannerSearching: {
    backgroundColor: 'rgba(59, 130, 246, 0.14)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  guidanceBannerTextCol: {
    flex: 1,
  },
  guidanceBannerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  guidanceBannerSubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },

  // SENSIBILITY SELECTOR
  sensitivityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sensitivityTitle: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  sensitivityPills: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 2,
    gap: 2,
  },
  sensPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sensPillActive: {
    backgroundColor: THEME.colors.accent,
  },
  sensPillText: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  sensPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // SENSOR STATUS ROW
  sensorStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sensorStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 5,
  },
  sensorStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sensorStatusText: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },

  // COMPASS WRAPPER & BEZEL
  compassWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  sightLineIndicator: {
    alignItems: 'center',
    marginBottom: 6,
  },
  sightLineArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#EF4444',
  },
  sightLineArrowAligned: {
    borderBottomColor: '#10B981',
  },
  sightLineText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  sightLineTextAligned: {
    color: '#10B981',
  },
  compassBezel: {
    borderRadius: COMPASS_SIZE / 2,
    backgroundColor: '#0C1021',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  rotatingRose: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // TICKS & GRADUATIONS
  tickMarkerContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tickMark: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  tickMarkMajor: {
    width: 2,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  tickMarkMinor: {
    width: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  // CARDINAL LABELS
  cardinalContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 12,
  },
  cardinalMajorText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  cardinalMinorText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textMuted,
  },

  // RADAR & ORBIT LINES
  innerGraduationRing: {
    position: 'absolute',
    width: '74%',
    height: '74%',
    borderRadius: COMPASS_SIZE,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  orbitTrackRing: {
    position: 'absolute',
    width: '54%',
    height: '54%',
    borderRadius: COMPASS_SIZE,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(249, 115, 22, 0.35)',
  },
  crosshairH: {
    position: 'absolute',
    width: '40%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  crosshairV: {
    position: 'absolute',
    width: 1,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },

  // ISS BEACON & BLIP
  issBeaconContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  issRadialRay: {
    position: 'absolute',
    top: 26,
    width: 1.5,
    height: COMPASS_SIZE / 2 - 26,
    backgroundColor: 'rgba(249, 115, 22, 0.25)',
  },
  issBlip: {
    marginTop: 22,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 6,
  },
  issBlipDefault: {
    backgroundColor: '#F97316',
  },
  issBlipAligned: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
  },
  issBlipHalo: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(249, 115, 22, 0.25)',
  },
  issBlipHaloAligned: {
    backgroundColor: 'rgba(16, 185, 129, 0.35)',
  },
  issTagBadge: {
    position: 'absolute',
    top: -16,
    backgroundColor: 'rgba(11, 13, 23, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#F97316',
  },
  issTagBadgeAligned: {
    borderColor: '#10B981',
  },
  issTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },

  // CENTRAL COMPASS HUB
  compassHub: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#11162A',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  compassHubAligned: {
    borderColor: '#10B981',
    backgroundColor: '#064E3B',
  },
  compassHubHeading: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  compassHubCardinal: {
    color: THEME.colors.gold,
    fontSize: 10,
    fontWeight: '700',
  },

  // READOUT BAR
  readoutBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%',
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  readoutCol: {
    alignItems: 'center',
    flex: 1,
  },
  readoutLabel: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  readoutVal: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  readoutSub: {
    color: THEME.colors.accent,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 1,
  },
  readoutDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  // SIMULATION PANEL
  simulationPanel: {
    backgroundColor: 'rgba(255, 183, 3, 0.08)',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 183, 3, 0.25)',
  },
  simulationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  simulationTitle: {
    color: THEME.colors.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  simulationDesc: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginBottom: 8,
  },
  simButtonsGrid: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  simPresetBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  simPresetText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  simActionRow: {
    flexDirection: 'row',
    gap: 6,
  },
  simStepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 6,
    gap: 4,
  },
  simStepText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  simAlignBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.accent,
    paddingVertical: 7,
    borderRadius: 6,
    gap: 4,
  },
  simAlignText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  // TELEMETRY CARD
  telemetryCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
  },
  telemetryTitle: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  loadingText: {
    color: THEME.colors.textMuted,
    fontSize: 12,
  },
  telemetryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  telemetryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    padding: 8,
    gap: 8,
  },
  telemetryTextCol: {
    flex: 1,
  },
  telemetryLabel: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    marginBottom: 1,
  },
  telemetryVal: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  explanationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 183, 3, 0.06)',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 183, 3, 0.18)',
  },
  explanationText: {
    flex: 1,
    color: '#D1D5DB',
    fontSize: 11,
    lineHeight: 16,
  },
});
