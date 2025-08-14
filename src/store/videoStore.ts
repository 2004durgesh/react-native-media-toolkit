import { create } from 'zustand';
import { withTiming } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import type { VideoState, VideoTheme, VideoPlayerConfig } from '../types/video';
import { defaultTheme } from '../themes/presets/defaultTheme';

const defaultConfig: VideoPlayerConfig = {
  autoHideControls: true,
  autoHideDelay: 5000,
  autoPlay: true,
  showTimeRemaining: false,
  enableGestures: true,
  enableFullscreen: true,
  enableVolumeControl: true,
  playbackRates: [0.5, 1, 1.25, 1.5, 2],
  skin: 'default',
};

interface VideoStore extends VideoState {
  config: VideoPlayerConfig;
  theme: VideoTheme;
  videoRef: React.RefObject<any> | null;
  controlsOpacity: SharedValue<number> | null;
  hideTimeoutRef: NodeJS.Timeout | null;

  // Actions
  initialize: (props: { theme?: Partial<VideoTheme>; config?: Partial<VideoPlayerConfig> }) => void;
  setControlsOpacity: (opacity: SharedValue<number>) => void;
  setVideoRef: (ref: React.RefObject<any>) => void;
  showControls: () => void;
  hideControls: () => void;
  toggleControls: () => void;
  seek: (time: number) => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  setPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setBuffering: (isBuffering: boolean) => void;
  setError: (error: string | null) => void;
}

export const useVideoStore = create<VideoStore>((set, get) => ({
  isPlaying: defaultConfig.autoPlay,
  currentTime: 0,
  duration: 0,
  buffering: false,
  muted: false,
  volume: 1,
  playbackRate: 1,
  fullscreen: false,
  error: null,

  // Default config and theme
  config: defaultConfig,
  theme: defaultTheme,

  // Refs and animation values
  videoRef: null,
  controlsOpacity: null,
  hideTimeoutRef: null,

  // --- ACTIONS ---

  initialize: ({ theme = {}, config = {} }) => {
    set({
      theme: {
        ...defaultTheme,
        ...theme,
        colors: { ...defaultTheme.colors, ...theme.colors },
        sizing: { ...defaultTheme.sizing, ...theme.sizing },
        fonts: { ...defaultTheme.fonts, ...theme.fonts },
        fontSizes: { ...defaultTheme.fontSizes, ...theme.fontSizes },
        borderRadius: defaultTheme.borderRadius ?? theme.borderRadius,
        animations: { ...defaultTheme.animations, ...theme.animations },
      },
      config: { ...defaultConfig, ...config },
    });
  },

  setControlsOpacity: (opacity) => set({ controlsOpacity: opacity }),
  setVideoRef: (ref) => set({ videoRef: ref }),

  // State setters (used by VideoCore)
  setPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setBuffering: (buffering) => set({ buffering }),
  setError: (error) => set({ error }),

  // Control Actions
  showControls: () => {
    const { hideTimeoutRef, controlsOpacity, theme, config, isPlaying } = get();
    if (hideTimeoutRef) {
      clearTimeout(hideTimeoutRef);
    }

    if (controlsOpacity) {
      controlsOpacity.value = withTiming(1, {
        duration: theme.animations.fast,
      });
    }

    if (config.autoHideControls && isPlaying) {
      const newTimeout = setTimeout(() => get().hideControls(), config.autoHideDelay);
      set({ hideTimeoutRef: newTimeout });
    }
  },

  hideControls: () => {
    const { controlsOpacity, theme } = get();
    if (controlsOpacity) {
      controlsOpacity.value = withTiming(0, {
        duration: theme.animations.normal,
      });
    }
  },

  toggleControls: () => {
    const { controlsOpacity } = get();
    if (controlsOpacity) {
      const isVisible = controlsOpacity.value > 0.5;
      if (isVisible) get().hideControls();
      else get().showControls();
    } else {
      get().showControls();
    }
  },

  seek: (time) => {
    const { videoRef, duration } = get();
    if (videoRef?.current) {
      const newTime = Math.max(0, Math.min(time, duration));
      videoRef.current.seek(newTime);
      set({ currentTime: newTime });
    }
  },

  togglePlayPause: () => {
    const newPlayingState = !get().isPlaying;
    set({ isPlaying: newPlayingState });
    if (newPlayingState) {
      get().showControls();
    } else if (get().hideTimeoutRef) {
      clearTimeout(get().hideTimeoutRef!);
      get().showControls();
    }
  },

  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
  toggleMute: () => set((state) => ({ muted: !state.muted })),
  toggleFullscreen: () => set((state) => ({ fullscreen: !state.fullscreen })),
}));

// Create a hook alias for convenience in components
export const useVideo = useVideoStore;
