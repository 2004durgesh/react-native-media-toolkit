import { createContext, useReducer, useCallback, useContext, type ReactNode, type RefObject } from 'react';
import { withTiming } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import type { VideoState, VideoTheme, VideoPlayerConfig } from '../types/video';

// Default theme and config
const defaultTheme: VideoTheme = {
  colors: {
    primary: '#007AFF',
    secondary: '#8E8E93',
    accent: '#FF9500',
    background: '#000000',
    overlay: 'rgba(0, 0, 0, 0.6)',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    error: '#FF3B30',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  borderRadius: 8,
  fonts: { regular: 'System', medium: 'System', bold: 'System' },
  animations: { fast: 150, normal: 300, slow: 500 },
};

const defaultConfig: VideoPlayerConfig = {
  autoHideControls: true,
  autoHideDelay: 3000,
  showTimeRemaining: false,
  enableGestures: true,
  enableFullscreen: true,
  enableVolumeControl: true,
  playbackRates: [0.5, 1, 1.25, 1.5, 2],
  skin: 'default',
};

interface VideoStoreState extends VideoState {
  config: VideoPlayerConfig;
  theme: VideoTheme;
  videoRef: RefObject<any> | null;
  controlsOpacity: SharedValue<number> | null;
  hideTimeoutRef: ReturnType<typeof setTimeout> | null;
}

type VideoAction =
  | { type: 'INITIALIZE'; payload: { theme?: Partial<VideoTheme>; config?: Partial<VideoPlayerConfig> } }
  | { type: 'SET_CONTROLS_OPACITY'; payload: SharedValue<number> }
  | { type: 'SET_VIDEO_REF'; payload: RefObject<any> }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_BUFFERING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'TOGGLE_FULLSCREEN' }
  | { type: 'SET_HIDE_TIMEOUT'; payload: ReturnType<typeof setTimeout> | null };

const initialState: VideoStoreState = {
  // Video state
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  buffering: false,
  muted: false,
  volume: 1,
  playbackRate: 1,
  fullscreen: false,
  error: null,

  // Store specific
  config: defaultConfig,
  theme: defaultTheme,
  videoRef: null,
  controlsOpacity: null,
  hideTimeoutRef: null,
};

function videoReducer(state: VideoStoreState, action: VideoAction): VideoStoreState {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        theme: {
          ...defaultTheme,
          ...action.payload.theme,
          colors: { ...defaultTheme.colors, ...action.payload.theme?.colors },
          spacing: { ...defaultTheme.spacing, ...action.payload.theme?.spacing },
          fonts: { ...defaultTheme.fonts, ...action.payload.theme?.fonts },
          animations: { ...defaultTheme.animations, ...action.payload.theme?.animations },
        },
        config: { ...defaultConfig, ...action.payload.config },
      };
    case 'SET_CONTROLS_OPACITY':
      return { ...state, controlsOpacity: action.payload };
    case 'SET_VIDEO_REF':
      return { ...state, videoRef: action.payload };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_BUFFERING':
      return { ...state, buffering: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: Math.max(0, Math.min(1, action.payload)) };
    case 'TOGGLE_MUTE':
      return { ...state, muted: !state.muted };
    case 'TOGGLE_FULLSCREEN':
      return { ...state, fullscreen: !state.fullscreen };
    case 'SET_HIDE_TIMEOUT':
      return { ...state, hideTimeoutRef: action.payload };
    default:
      return state;
  }
}

interface VideoContextType {
  state: VideoStoreState;
  actions: {
    initialize: (props: { theme?: Partial<VideoTheme>; config?: Partial<VideoPlayerConfig> }) => void;
    setControlsOpacity: (opacity: SharedValue<number>) => void;
    setVideoRef: (ref: RefObject<any>) => void;
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
  };
}

const VideoContext = createContext<VideoContextType | null>(null);

interface VideoProviderProps {
  children: ReactNode;
}

export function VideoProvider({ children }: VideoProviderProps) {
  const [state, dispatch] = useReducer(videoReducer, initialState);

  // Create stable action references using useCallback
  const initialize = useCallback((props: { theme?: Partial<VideoTheme>; config?: Partial<VideoPlayerConfig> }) => {
    dispatch({ type: 'INITIALIZE', payload: props });
  }, []);

  const setControlsOpacity = useCallback((opacity: SharedValue<number>) => {
    dispatch({ type: 'SET_CONTROLS_OPACITY', payload: opacity });
  }, []);

  const setVideoRef = useCallback((ref: RefObject<any>) => {
    dispatch({ type: 'SET_VIDEO_REF', payload: ref });
  }, []);

  const showControls = useCallback(() => {
    if (state.hideTimeoutRef) {
      clearTimeout(state.hideTimeoutRef);
    }

    const controlsOpacity = state.controlsOpacity;
    if (controlsOpacity) {
      controlsOpacity.value = withTiming(1, {
        duration: state.theme.animations.fast,
      });
    }

    if (state.config.autoHideControls && state.isPlaying) {
      const newTimeout = setTimeout(() => {
        if (controlsOpacity) {
          controlsOpacity.value = withTiming(0, {
            duration: state.theme.animations.normal,
          });
        }
      }, state.config.autoHideDelay);
      dispatch({ type: 'SET_HIDE_TIMEOUT', payload: newTimeout });
    }
  }, [
    state.hideTimeoutRef,
    state.controlsOpacity,
    state.theme.animations.fast,
    state.config.autoHideControls,
    state.isPlaying,
    state.config.autoHideDelay,
    state.theme.animations.normal,
  ]);

  const hideControls = useCallback(() => {
    const controlsOpacity = state.controlsOpacity;
    if (controlsOpacity) {
      controlsOpacity.value = withTiming(0, {
        duration: state.theme.animations.normal,
      });
    }
  }, [state.controlsOpacity, state.theme.animations.normal]);

  const toggleControls = useCallback(() => {
    const controlsOpacity = state.controlsOpacity;
    if (controlsOpacity) {
      const isVisible = controlsOpacity.value > 0.5;
      if (isVisible) {
        controlsOpacity.value = withTiming(0, {
          duration: state.theme.animations.normal,
        });
      } else {
        if (state.hideTimeoutRef) {
          clearTimeout(state.hideTimeoutRef);
        }

        controlsOpacity.value = withTiming(1, {
          duration: state.theme.animations.fast,
        });

        if (state.config.autoHideControls && state.isPlaying) {
          const newTimeout = setTimeout(() => {
            if (controlsOpacity) {
              controlsOpacity.value = withTiming(0, {
                duration: state.theme.animations.normal,
              });
            }
          }, state.config.autoHideDelay);
          dispatch({ type: 'SET_HIDE_TIMEOUT', payload: newTimeout });
        }
      }
    } else {
      if (state.hideTimeoutRef) {
        clearTimeout(state.hideTimeoutRef);
      }

      if (state.config.autoHideControls && state.isPlaying) {
        const newTimeout = setTimeout(() => {
          const opacity = state.controlsOpacity;
          if (opacity) {
            opacity.value = withTiming(0, {
              duration: state.theme.animations.normal,
            });
          }
        }, state.config.autoHideDelay);
        dispatch({ type: 'SET_HIDE_TIMEOUT', payload: newTimeout });
      }
    }
  }, [
    state.controlsOpacity,
    state.hideTimeoutRef,
    state.theme.animations.fast,
    state.theme.animations.normal,
    state.config.autoHideControls,
    state.isPlaying,
    state.config.autoHideDelay,
  ]);

  const seek = useCallback(
    (time: number) => {
      if (state.videoRef?.current) {
        const newTime = Math.max(0, Math.min(time, state.duration));
        state.videoRef.current.seek(newTime);
        dispatch({ type: 'SET_CURRENT_TIME', payload: newTime });
      }
    },
    [state.videoRef, state.duration]
  );

  const togglePlayPause = useCallback(() => {
    const newPlayingState = !state.isPlaying;
    dispatch({ type: 'SET_PLAYING', payload: newPlayingState });

    const controlsOpacity = state.controlsOpacity;
    if (newPlayingState) {
      // Show controls when starting to play
      if (state.hideTimeoutRef) {
        clearTimeout(state.hideTimeoutRef);
      }

      if (controlsOpacity) {
        controlsOpacity.value = withTiming(1, {
          duration: state.theme.animations.fast,
        });
      }

      if (state.config.autoHideControls) {
        const newTimeout = setTimeout(() => {
          if (controlsOpacity) {
            controlsOpacity.value = withTiming(0, {
              duration: state.theme.animations.normal,
            });
          }
        }, state.config.autoHideDelay);
        dispatch({ type: 'SET_HIDE_TIMEOUT', payload: newTimeout });
      }
    } else if (state.hideTimeoutRef) {
      clearTimeout(state.hideTimeoutRef);
      // Show controls when paused
      if (controlsOpacity) {
        controlsOpacity.value = withTiming(1, {
          duration: state.theme.animations.fast,
        });
      }
    }
  }, [
    state.isPlaying,
    state.hideTimeoutRef,
    state.controlsOpacity,
    state.theme.animations.fast,
    state.theme.animations.normal,
    state.config.autoHideControls,
    state.config.autoHideDelay,
  ]);

  const setVolume = useCallback((volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: volume });
  }, []);

  const toggleMute = useCallback(() => {
    dispatch({ type: 'TOGGLE_MUTE' });
  }, []);

  const toggleFullscreen = useCallback(() => {
    dispatch({ type: 'TOGGLE_FULLSCREEN' });
  }, []);

  const setPlaying = useCallback((isPlaying: boolean) => {
    dispatch({ type: 'SET_PLAYING', payload: isPlaying });
  }, []);

  const setCurrentTime = useCallback((time: number) => {
    dispatch({ type: 'SET_CURRENT_TIME', payload: time });
  }, []);

  const setDuration = useCallback((duration: number) => {
    dispatch({ type: 'SET_DURATION', payload: duration });
  }, []);

  const setBuffering = useCallback((isBuffering: boolean) => {
    dispatch({ type: 'SET_BUFFERING', payload: isBuffering });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const actions = {
    initialize,
    setControlsOpacity,
    setVideoRef,
    showControls,
    hideControls,
    toggleControls,
    seek,
    togglePlayPause,
    setVolume,
    toggleMute,
    toggleFullscreen,
    setPlaying,
    setCurrentTime,
    setDuration,
    setBuffering,
    setError,
  };

  const contextValue: VideoContextType = {
    state,
    actions,
  };

  return <VideoContext.Provider value={contextValue}>{children}</VideoContext.Provider>;
}

// Standard React hook using useContext
export function useVideo(): VideoContextType;
export function useVideo<T>(selector: (state: VideoStoreState) => T): T;
export function useVideo<T>(selector?: (state: VideoStoreState) => T): VideoContextType | T {
  const context = useContext(VideoContext);

  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }

  if (selector) {
    return selector(context.state);
  }

  return context;
}

// Convenience hooks for common selectors
export const useVideoState = () => useVideo((state) => state);
export const useVideoActions = () => {
  const context = useVideo();
  return context.actions;
};
export const useVideoConfig = () => useVideo((state) => state.config);
export const useVideoTheme = () => useVideo((state) => state.theme);
