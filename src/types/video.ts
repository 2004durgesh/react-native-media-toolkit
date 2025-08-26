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

export interface VideoPlayerConfig {
  autoHideControls: boolean;
  autoPlay: boolean;
  autoHideDelay: number;
  enableDoubleTapGestures: boolean;
  enableFullscreen: boolean;
  enableVolumeControl: boolean;
  enablePanGestures: boolean;
  enableScreenRotation: boolean;
  playbackRates: number[];
  onEnterFullscreen?: () => void;
  onExitFullscreen?: () => void;
  onHideControls?: () => void;
  onShowControls?: () => void;
}
