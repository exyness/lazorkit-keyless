import { StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from './constants';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background,
  },
  
  // Header
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
    transform: [{ translateX: -80 }],
  },
  placeholder: { width: 48 },
  
  scrollContainer: {
    flex: 1,
  },
  content: { 
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxxl,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },

  // Transactions List
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  transactionDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    opacity: 0.8,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 11,
    color: Colors.textSecondary,
    opacity: 0.6,
  },
  transactionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionValue: {
    fontSize: 15,
    fontWeight: Typography.semibold,
    marginBottom: 2,
  },
  transactionSend: {
    color: Colors.error,
  },
  transactionReceive: {
    color: Colors.success,
  },
  transactionNeutral: {
    color: Colors.textSecondary,
  },
  transactionUsd: {
    fontSize: 11,
    color: Colors.textSecondary,
    opacity: 0.6,
  },
  explorerButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: Spacing.xxxl,
  },
  emptyTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.7,
  },
});