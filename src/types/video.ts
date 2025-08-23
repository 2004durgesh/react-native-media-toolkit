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
    success: string;
    border: string;
    focus: string;
  };
  sizing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  iconSizes: {
    sm: number;
    md: number;
    lg: number;
  };
  borderRadius: number;
  fonts: {
    regular: string;
    medium: string;
    bold: string;
  };
  fontSizes: {
    sm: number;
    md: number;
    lg: number;
  };
  animations: {
    fast: number;
    normal: number;
    slow: number;
  };
}

export interface VideoPlayerConfig {
  autoHideControls: boolean;
  autoPlay: boolean;
  autoHideDelay: number;
  enableGestures: boolean;
  enableFullscreen: boolean;
  enableVolumeControl: boolean;
  enableScreenRotation: boolean;
  playbackRates: number[];
  layout: 'default' | 'minimal' | 'netflix' | 'youtube';
}
