import type { VideoTheme } from '../../types';

export const defaultTheme: VideoTheme = {
  colors: {
    primary: '#4F8EF7', // Vibrant blue for main actions (play, seek, etc.)
    secondary: '#7A7F8D', // Muted gray-blue for secondary buttons
    accent: '#F5B041', // Warm highlight for progress, hover states
    background: '#0B0B0D', // Deep charcoal background
    overlay: 'rgba(0, 0, 0, 0.6)', // Semi-transparent overlay for modals/controls
    text: '#FFFFFF', // Main text
    textSecondary: '#B3B3B3', // Secondary text (duration, tooltips)
    error: '#E74C3C', // Red for errors
    success: '#2ECC71', // Green for success states
    border: '#2F2F35', // Subtle border for sliders, inputs
    focus: '#FFD166', // Bright yellow for focus ring (keyboard navigation)
  },
  sizing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  iconSizes: {
    sm: 16,
    md: 24,
    lg: 32,
  },
  borderRadius: 8,
  fonts: { regular: 'System', medium: 'System', bold: 'System' },
  fontSizes: {
    sm: 12,
    md: 14,
    lg: 16,
  },
  animations: { fast: 150, normal: 300, slow: 500 },
};
