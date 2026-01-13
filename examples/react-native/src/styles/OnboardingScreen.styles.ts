import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from './constants';

const { width: screenWidth } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.sm,
    zIndex: 10,
  },
  skipButton: {
    padding: Spacing.sm,
  },
  skipText: { 
    fontSize: Typography.sm, 
    color: Colors.textSecondary, 
    fontWeight: Typography.medium,
  },

  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexDirection: 'row',
  },
  page: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  stepContent: {
    flex: 1,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- Visual Assets ---
  visualContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  glowUnderlay: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    transform: [{ scale: 1.5 }],
    opacity: 0.5,
  },
  visualContainerCompact: {
    marginBottom: Spacing.xxl,
    alignItems: 'center',
  },

  // Screen 1: Glass Square
  glassPanelSquare: {
    width: 192,
    height: 192,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  handImage: {
    width: 112,
    height: 112,
  },
  glassBorderOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },

  // Screen 2 & 3: Glass Circle
  glassPanelCircle: {
    width: 192,
    height: 192,
    borderRadius: 96,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  handCircleImage: {
    width: 112,
    height: 112,
  },
  glassCircleBorderOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 96,
    borderWidth: 1,
    borderColor: 'rgba(76, 75, 75, 0.5)',
  },
  glassCircleLarge: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },

  // Screen 3: Floating Badge
  floatingBadge: {
    position: 'absolute',
    bottom: 18,
    right: 20,
    backgroundColor: '#1A1A1E',
    width: 50,
    height: 50,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },

  // Screen 4: Compact Glass Panel
  glassPanelCompact: {
    width: 112,
    height: 112,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  glassBorderOverlayCompact: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },

  // --- Typography ---
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: Spacing.sm,
  },
  textContainerCompact: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    paddingHorizontal: Spacing.sm,
  },
  displayTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  subtitleBrand: {
    fontSize: Typography.lg,
    color: Colors.textPrimary,
    fontWeight: Typography.medium,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitleNormal: {
    fontSize: Typography.lg,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  bodyText: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '300',
    opacity: 0.9,
  },
  bodyTextSmall: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.7,
    maxWidth: 280,
  },

  // --- Cards & Lists ---
  // Screen 2
  cardContainerDark: {
    width: '100%',
    backgroundColor: '#0D0E12',
    borderRadius: BorderRadius.lg + 8, // 24
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconSymbol: {
    fontSize: 20,
    color: Colors.textPrimary,
  },
  featureText: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    fontWeight: Typography.medium,
    letterSpacing: 0.5,
  },

  // Screen 3
  glassCardContainer: {
    width: '100%',
    backgroundColor: Colors.surfaceDark,
    borderRadius: BorderRadius.lg + 8, // 24
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  glassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconBadgeTransparent: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceDark,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    fontWeight: Typography.medium,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    opacity: 0.7,
  },

  // Screen 4
  benefitsContainer: {
    width: '100%',
    backgroundColor: Colors.surfaceDark,
    borderRadius: BorderRadius.lg + 8, // 24
    padding: Spacing.xxl,
    borderWidth: 1,
    borderColor: 'rgba(42, 42, 46, 0.5)',
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  iconBadgeOutline: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.xl,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  benefitTitle: {
    fontSize: Typography.md,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: 4,
  },
  benefitSubtitle: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    opacity: 0.7,
    fontWeight: Typography.medium,
  },

  // --- Footer ---
  footer: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Platform.OS === 'android' ? Spacing.xxl : 0,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    height: 20,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 32, // w-8 in HTML
    backgroundColor: Colors.textPrimary,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  dotInactive: {
    width: 6, // w-1.5 in HTML
    backgroundColor: Colors.surfaceDark,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },

  buttonContainer: {
    gap: Spacing.md,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg + 2, // 18
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(255, 255, 255, 0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    width: '100%',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: Colors.accentText,
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },
  secondaryButton: {
    backgroundColor: Colors.surfaceDark,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg + 2, // 18
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    width: '100%',
  },
  secondaryButtonText: {
    color: Colors.textPrimary,
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },
  
  // Side by side buttons for final screen
  sideBySideButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  primaryButtonHalf: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg + 2, // 18
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(255, 255, 255, 0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    flex: 1,
  },
  secondaryButtonHalf: {
    backgroundColor: Colors.surfaceDark,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg + 2, // 18
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    flex: 1,
  },
  loadingTextSmall: {
    color: Colors.accentText,
    fontWeight: Typography.semibold,
    marginLeft: Spacing.sm,
    fontSize: Typography.sm,
  },
  loadingTextSmallSecondary: {
    color: Colors.textPrimary,
    fontWeight: Typography.semibold,
    marginLeft: Spacing.sm,
    fontSize: Typography.sm,
  },
  
  // States
  buttonDisabled: {
    opacity: 0.7,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.accentText,
    fontWeight: Typography.semibold,
    marginLeft: Spacing.sm,
  },
});