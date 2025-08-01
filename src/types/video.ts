export interface VideoSource {
  uri: string;
  type?: string;
  headers?: Record<string, string>;
}

export interface VideoState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  buffering: boolean;
  muted: boolean;
  volume: number;
  playbackRate: number;
  fullscreen: boolean;
  error: string | null;
}

export interface VideoTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    overlay: string;
    text: string;
    textSecondary: string;
    error: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: number;
  fonts: {
    regular: string;
    medium: string;
    bold: string;
  };
  animations: {
    fast: number;
    normal: number;
    slow: number;
  };
}

export interface VideoPlayerConfig {
  autoHideControls: boolean;
  autoHideDelay: number;
  showTimeRemaining: boolean;
  enableGestures: boolean;
  enableFullscreen: boolean;
  enableVolumeControl: boolean;
  playbackRates: number[];
  skin: 'default' | 'minimal' | 'netflix' | 'custom';
}
