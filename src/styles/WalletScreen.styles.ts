import { StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from './constants';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  content: { padding: Spacing.xxl },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  loadingText: {
    fontSize: Typography.md,
    color: '#6e6e73',
    fontWeight: Typography.medium,
  },
  header: { 
    alignItems: 'center', 
    paddingTop: Spacing.xxxl, 
    paddingBottom: Spacing.xxxl,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  welcomeIcon: {
    width: 32,
    height: 32,
  },
  titleContainer: {
    alignItems: 'center',
    gap: 4,
  },
  title: { 
    fontSize: 24, 
    fontWeight: Typography.bold, 
    color: Colors.textPrimary, 
    letterSpacing: -0.5 
  },
  subtitle: { 
    fontSize: Typography.sm, 
    color: Colors.blue, 
    fontWeight: Typography.medium,
  },
  connectContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 60 
  },
  iconContainer: {
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1, 
    borderColor: Colors.glassBorder,
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: Spacing.xxxl,
    shadowColor: 'rgba(59, 130, 246, 0.2)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, 
    shadowRadius: 40,
  },
  iconText: { fontSize: 56 },
  welcomeTitle: { 
    fontSize: 28, 
    fontWeight: Typography.bold, 
    color: Colors.textPrimary, 
    marginBottom: Spacing.md, 
    letterSpacing: -0.5 
  },
  welcomeText: { 
    fontSize: Typography.md, 
    color: Colors.textSecondary, 
    textAlign: 'center', 
    marginBottom: 40, 
    paddingHorizontal: Spacing.xxxl, 
    lineHeight: 24 
  },
  button: { 
    paddingVertical: Spacing.lg, 
    paddingHorizontal: Spacing.xxxl, 
    borderRadius: BorderRadius.lg, 
    alignItems: 'center' 
  },
  primaryButton: { 
    backgroundColor: Colors.accent, 
    minWidth: 240,
    shadowColor: 'rgba(221, 224, 233, 0.15)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  buttonText: { 
    color: Colors.accentText, 
    fontSize: Typography.lg, 
    fontWeight: Typography.bold,
  },
  dashboard: { 
    gap: Spacing.lg,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  
  // Balance Card - Glass Panel Design
  balanceSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  refreshButtonTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: 6,
    alignSelf: 'flex-end',
  },
  refreshButtonText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  refreshButtonTextActive: {
    color: '#0071e3',
  },
  balanceContainer: {
    alignItems: 'center',
    width: '100%',
  },
  balanceGlassPanel: {
    width: '100%',
    borderRadius: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    position: 'relative',
    backgroundColor: Colors.surface,
  },
  balanceCard: {
    padding: Spacing.xxl,
    width: '100%',
  },
  balanceGlassBorderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  balanceHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  balanceLabel: { 
    fontSize: Typography.sm, 
    color: Colors.textSecondary, 
    fontWeight: Typography.medium,
  },
  balanceAmountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  balanceAmount: { 
    fontSize: 32, 
    fontWeight: Typography.bold, 
    color: Colors.textPrimary,
  },
  balanceCurrency: {
    fontSize: 20,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },

  // Action Grid - 2x2 Layout
  actionGrid2x2: { 
    width: '100%',
    gap: Spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  gridButton: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
    minHeight: 60,
  },
  sendButton: { 
    backgroundColor: Colors.accent,
    shadowColor: 'rgba(221, 224, 233, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  receiveButton: { 
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  signMessageButton: {
    backgroundColor: Colors.successBg,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.4)',
  },
  disconnectButton: {
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.4)',
  },
  gridIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(4, 4, 1, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridIconContainerGlass: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridIconContainerSign: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridIconContainerDisconnect: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: { 
    fontSize: Typography.md, 
    fontWeight: Typography.semibold, 
    color: Colors.accentText,
  },
  receiveButtonText: { 
    fontSize: Typography.md, 
    fontWeight: Typography.semibold, 
    color: Colors.textPrimary,
  },
  signMessageText: { 
    fontSize: Typography.md, 
    fontWeight: Typography.semibold, 
    color: Colors.success,
  },
  disconnectText: { 
    fontSize: Typography.md, 
    color: Colors.error, 
    fontWeight: Typography.semibold,
  },
  
  // Full width button for Sign Message
  fullWidthButton: {
    width: '100%',
  },
  
  // Disconnect button at bottom
  disconnectButtonBottom: {
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.4)',
    width: '100%',
  },

  // Recent Transactions
  transactionsSection: {
    width: '100%',
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: 4,
  },
  transactionsTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  viewAllButton: {
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  viewAllText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  transactionsList: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    overflow: 'hidden',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  lastTransactionItem: {
    borderBottomWidth: 0,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    opacity: 0.7,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionValue: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    marginBottom: 2,
  },
  transactionSend: {
    color: Colors.error,
  },
  transactionReceive: {
    color: Colors.success,
  },
  transactionSign: {
    color: Colors.success,
  },
  transactionNeutral: {
    color: Colors.textSecondary,
  },
  transactionStatus: {
    fontSize: 10,
    color: Colors.textSecondary,
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  loadingTransactions: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    padding: 40,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  loadingTransactionsText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  emptyTransactions: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    padding: 40,
    alignItems: 'center',
  },
  emptyTransactionsText: {
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptyTransactionsSubtext: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    opacity: 0.7,
    textAlign: 'center',
  },

  // Reset Button (Dev)
  resetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: Spacing.md,
    paddingVertical: 14,
    paddingHorizontal: Spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  resetText: { 
    fontSize: Typography.sm, 
    color: Colors.textSecondary, 
    fontWeight: Typography.medium,
  },

  // Onboarding Button
  onboardingButton: {
    marginTop: Spacing.xl,
    paddingVertical: 14,
    paddingHorizontal: Spacing.xxl,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  onboardingButtonText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },

  // Dev Info Card - Blue accent
  devInfoCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  devTitle: { 
    fontSize: Typography.sm, 
    fontWeight: Typography.semibold, 
    color: Colors.blue, 
    marginBottom: 4 
  },
  devText: { 
    fontSize: Typography.xs, 
    color: 'rgba(59, 130, 246, 0.8)', 
    lineHeight: 18 
  },
});