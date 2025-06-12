/**
 * Liquid Glass Design System
 * Based on Apple's latest design language from WWDC
 */

export const colors = {
  // Base colors with transparency for glass effect
  glassLight: 'rgba(255, 255, 255, 0.65)',
  glassDark: 'rgba(30, 30, 30, 0.65)',
  glassPrimary: 'rgba(74, 144, 226, 0.75)',
  glassAccent: 'rgba(255, 149, 0, 0.75)',
  glassError: 'rgba(255, 59, 48, 0.75)',
  glassSuccess: 'rgba(52, 199, 89, 0.75)',

  // Solid colors for text and icons
  textDark: '#333333',
  textLight: '#FFFFFF',
  textMuted: 'rgba(60, 60, 67, 0.6)',

  // Interactive colors
  interactive: '#4A90E2',
  interactivePressed: '#3A7BC8',

  // Background shades
  backgroundLight: '#F2F2F7',
  backgroundDark: '#1C1C1E',

  // Subtle highlight
  highlight: 'rgba(255, 255, 255, 0.8)',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const borderRadius = {
  small: 8,
  medium: 16,
  large: 24,
  pill: 9999,
};

export const fontSizes = {
  xs: 12,
  s: 14,
  m: 16,
  l: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const blurIntensity = {
  light: 10,
  medium: 35,
  heavy: 65,
};

export const animations = {
  // Spring configurations for fluid, organic motion
  spring: {
    gentle: {
      damping: 15,
      mass: 0.9,
      stiffness: 120,
    },
    responsive: {
      damping: 20,
      mass: 1,
      stiffness: 180,
    },
    bouncy: {
      damping: 12,
      mass: 1,
      stiffness: 120,
    },
  },
  // Durations for consistent timing
  duration: {
    short: 200,
    medium: 300,
    long: 500,
  },
};
