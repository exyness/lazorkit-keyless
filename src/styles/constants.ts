// Design system constants
export const Colors = {
  // Background
  background: '#040401',
  surface: 'rgba(255, 255, 255, 0.06)',
  surfaceBorder: 'rgba(255, 255, 255, 0.15)',
  surfaceDark: '#121214', // For cards and panels
  
  // Text
  textPrimary: '#dde0e9',
  textSecondary: '#ced7dc',
  textTertiary: '#555b61',
  
  // Accent
  accent: '#dde0e9',
  accentText: '#040401',
  
  // Success/Green
  success: '#4ade80',
  successBg: 'rgba(34, 197, 94, 0.1)',
  successBorder: 'rgba(34, 197, 94, 0.2)',
  
  // Error/Red
  error: '#ef4444',
  
  // Blue
  blue: '#3B82F6',
  
  // Borders
  border: '#2a2a2e',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
} as const;

export const Typography = {
  // Font sizes
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  
  // Font weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: 'bold' as const,
} as const;

// Common style patterns
export const CommonStyles = {
  glassPanel: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  
  input: {
    backgroundColor: '#0f0f11',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.md,
    color: Colors.textPrimary,
    fontWeight: Typography.medium,
  },
  
  primaryButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
} as const;