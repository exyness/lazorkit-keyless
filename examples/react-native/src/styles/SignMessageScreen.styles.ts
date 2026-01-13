import { StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from './constants';

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
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.lg,
  },
  backButton: { 
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
  },
  backText: { 
    fontSize: Typography.sm, 
    color: Colors.textSecondary, 
    fontWeight: Typography.medium,
  },
  title: { 
    fontSize: Typography.lg, 
    fontWeight: Typography.semibold, 
    color: Colors.textPrimary,
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -60 }],
  },
  placeholder: { width: 48 },
  
  scrollContainer: {
    flex: 1,
  },
  content: { 
    paddingHorizontal: Spacing.xxl,
    paddingBottom: 96,
    gap: Spacing.xxl,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },

  // Message Card - Glass panel
  messageCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  label: { 
    fontSize: Typography.sm, 
    color: Colors.textSecondary, 
    fontWeight: Typography.medium,
    paddingLeft: 4,
  },
  textArea: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: Spacing.md,
    padding: Spacing.lg,
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    minHeight: 128,
    lineHeight: 22,
  },

  // Quick Messages
  quickMessagesSection: {
    gap: Spacing.md,
  },
  quickMessagesTitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
    paddingLeft: 4,
  },
  quickMessages: { 
    gap: 10,
  },
  quickMessage: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickMessageText: { 
    fontSize: Typography.sm, 
    color: Colors.textPrimary,
    flex: 1,
  },

  // Sign Button
  signButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    shadowColor: 'rgba(221, 224, 233, 0.1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  signButtonDisabled: { opacity: 0.7 },
  signButtonText: { 
    color: Colors.accentText, 
    fontSize: Typography.md, 
    fontWeight: Typography.bold,
  },

  // Info Card - Blue accent
  infoCard: { 
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: BorderRadius.lg, 
    padding: Spacing.xl,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  infoContent: {
    flex: 1,
    gap: 4,
  },
  infoTitle: { 
    fontSize: Typography.sm, 
    fontWeight: Typography.semibold, 
    color: '#60a5fa',
  },
  infoText: { 
    fontSize: Typography.xs, 
    color: 'rgba(96, 165, 250, 0.7)', 
    lineHeight: 18,
  },

  // Modal styles
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
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
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
  copyBtn: { 
    padding: Spacing.sm,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  doneButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  doneText: { 
    color: Colors.accentText, 
    fontSize: Typography.sm, 
    fontWeight: Typography.semibold,
  },
});