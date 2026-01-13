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
  },
  placeholder: { width: 48 },
  
  content: { 
    flex: 1,
    paddingHorizontal: Spacing.xxl, 
    alignItems: 'center',
    gap: Spacing.xxl,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },

  // QR Card - Glass panel
  qrCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: Spacing.xxl + 8, // 32
    padding: Spacing.xxxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    width: '100%',
    marginTop: Spacing.lg,
    gap: Spacing.xxxl,
  },
  qrTitle: { 
    fontSize: Typography.md, 
    fontWeight: Typography.medium, 
    color: Colors.textPrimary,
    opacity: 0.9,
  },
  qrContainer: {
    position: 'relative',
    padding: Spacing.lg,
    backgroundColor: 'white',
    borderRadius: BorderRadius.lg,
  },

  // Address Section
  addressSection: {
    width: '100%',
    alignItems: 'center',
    gap: Spacing.md,
  },
  addressLabel: { 
    fontSize: Typography.xs, 
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  addressBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    width: '100%',
  },
  addressText: { 
    fontSize: Typography.sm, 
    fontWeight: Typography.medium, 
    color: Colors.textPrimary,
    fontFamily: 'monospace',
    flex: 1,
    textAlign: 'center',
  },
  fullAddress: {
    fontSize: 10,
    color: 'rgba(206, 215, 220, 0.6)',
    textAlign: 'center',
    lineHeight: 14,
    fontFamily: 'monospace',
    paddingHorizontal: Spacing.lg,
  },
  copyAddressButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    shadowColor: 'rgba(221, 224, 233, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  copyAddressText: { 
    color: Colors.accentText, 
    fontSize: Typography.sm, 
    fontWeight: Typography.medium,
  },

  // Important Notice - Yellow accent
  importantNotice: {
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.2)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: '100%',
    gap: Spacing.md,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  noticeTitle: { 
    fontSize: Typography.sm, 
    fontWeight: Typography.medium, 
    color: '#eab308',
  },
  noticeList: {
    gap: Spacing.sm,
  },
  noticeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  noticeBullet: {
    color: 'rgba(234, 179, 8, 0.7)',
    fontSize: Typography.xs,
    marginTop: 2,
  },
  noticeText: { 
    fontSize: Typography.xs, 
    color: 'rgba(234, 179, 8, 0.7)', 
    lineHeight: 18,
    flex: 1,
  },
  linkText: {
    color: '#eab308',
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(234, 179, 8, 0.3)',
  },
});