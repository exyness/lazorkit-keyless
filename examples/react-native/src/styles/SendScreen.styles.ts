import { StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, CommonStyles } from './constants';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background,
  },
  
  // Header - Matches UX design
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  backButton: { 
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
  },
  backText: { 
    fontSize: Typography.md, 
    color: Colors.textSecondary, 
    fontWeight: Typography.medium,
  },
  title: { 
    fontSize: Typography.xl, 
    fontWeight: Typography.semibold, 
    color: Colors.textPrimary,
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -40 }],
  },
  placeholder: { width: 64 },
  
  content: { 
    paddingHorizontal: Spacing.xxl, 
    gap: Spacing.xxl,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },

  // Input Card - Glass panel
  inputCard: {
    ...CommonStyles.glassPanel,
    padding: Spacing.xl,
    gap: Spacing.xxl,
  },
  inputSection: {
    gap: Spacing.sm,
  },
  label: { 
    fontSize: Typography.sm, 
    color: Colors.textSecondary, 
    fontWeight: Typography.medium,
    paddingLeft: 4,
  },
  labelRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  inputContainer: {
    position: 'relative',
  },
  input: CommonStyles.input,

  maxButton: { 
    position: 'absolute',
    right: Spacing.md,
    top: '50%',
    transform: [{ translateY: -12 }],
    backgroundColor: '#2a2a30',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md, 
    paddingVertical: 6, 
    borderRadius: BorderRadius.sm,
  },
  maxText: { 
    color: Colors.textPrimary, 
    fontSize: Typography.xs, 
    fontWeight: Typography.bold,
    letterSpacing: 0.5,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginTop: 10,
  },
  balanceText: { 
    fontSize: Typography.xs, 
    color: Colors.textSecondary,
  },
  balanceAmount: {
    color: Colors.textPrimary,
    fontWeight: Typography.medium,
  },
  usdText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },

  // Summary Card - Glass panel
  summaryCard: {
    ...CommonStyles.glassPanel,
    padding: Spacing.xl,
  },
  summaryTitle: { 
    fontSize: Typography.md, 
    fontWeight: Typography.medium, 
    color: Colors.textPrimary, 
    marginBottom: Spacing.lg,
    paddingLeft: 4,
  },
  summaryContent: {
    paddingHorizontal: 4,
  },
  summaryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: Spacing.sm,
  },
  summaryLabel: { 
    fontSize: Typography.sm, 
    color: Colors.textSecondary,
  },
  summaryValue: { 
    fontSize: Typography.sm, 
    color: Colors.textPrimary,
    fontWeight: Typography.medium,
  },
  summaryLabelBold: { 
    fontSize: Typography.md, 
    fontWeight: Typography.medium, 
    color: Colors.textPrimary,
    paddingTop: 4,
  },
  summaryValueBold: { 
    fontSize: Typography.md, 
    fontWeight: Typography.bold, 
    color: Colors.textPrimary,
    paddingTop: 4,
  },
  divider: { 
    height: 1, 
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    marginVertical: Spacing.sm,
  },

  // Send Button
  sendButton: {
    ...CommonStyles.primaryButton,
    gap: Spacing.sm,
    shadowColor: 'rgba(221, 224, 233, 0.15)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  sendButtonDisabled: { opacity: 0.7 },
  sendButtonText: { 
    color: Colors.accentText, 
    fontSize: Typography.lg, 
    fontWeight: Typography.bold,
  },

  // Gasless Notice - Green accent
  gaslessNotice: { 
    backgroundColor: Colors.successBg,
    borderWidth: 1,
    borderColor: Colors.successBorder,
    borderRadius: BorderRadius.lg, 
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  gaslessContent: {
    flex: 1,
  },
  gaslessTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.success,
    marginBottom: 4,
  },
  gaslessText: { 
    fontSize: Typography.xs, 
    color: 'rgba(74, 222, 128, 0.8)', 
    lineHeight: 18,
  },

  // Modal styles - Same as SignMessageScreen
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.surfaceDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxl,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: { 
    fontSize: Typography.xl, 
    fontWeight: Typography.bold, 
    color: Colors.textPrimary, 
    marginBottom: Spacing.lg, 
    textAlign: 'center',
  },
  resultSection: { 
    marginBottom: Spacing.lg,
  },
  resultLabel: { 
    fontSize: Typography.sm, 
    fontWeight: Typography.semibold, 
    color: Colors.textSecondary, 
    marginBottom: 4,
  },
  resultText: { 
    fontSize: Typography.sm, 
    color: Colors.textPrimary, 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    padding: Spacing.sm, 
    borderRadius: 6,
  },
  copyableRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    padding: Spacing.sm, 
    borderRadius: 6,
  },
  hashText: { 
    flex: 1, 
    fontSize: Typography.xs, 
    color: Colors.textPrimary, 
    fontFamily: 'monospace',
  },
  explorerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  explorerText: { 
    color: Colors.blue, 
    fontSize: Typography.sm, 
    fontWeight: Typography.medium,
  },
  doneButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    width: '100%',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  doneText: { 
    color: Colors.accentText, 
    fontSize: Typography.sm, 
    fontWeight: Typography.semibold,
  },
});