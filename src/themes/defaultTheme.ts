import type { Theme } from '../types';

export const defaultTheme: Theme = {
  colors: {
    primary: '#1DB954',
    secondary: '#535C68',
    accent: '#FF4F81',
    background: '#121212',
    overlay: 'rgba(0, 0, 0, 0.75)',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    error: '#FF3B30',
    success: '#34C759',
    border: '#2C2C2E',
    focus: '#FFD93D',
  },
  sizing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 40,
  },
  iconSizes: {
    sm: 18,
    md: 28,
    lg: 40,
  },
  borderRadius: 12,
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSizes: {
    sm: 13,
    md: 15,
    lg: 18,
  },
  animations: {
    fast: 120,
    normal: 250,
    slow: 600,
  },
};
