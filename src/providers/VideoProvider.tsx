import React, { createContext, useReducer, useContext, useEffect } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import type { VideoPlayerConfig, VideoState, VideoTheme } from 'src/types';
import { defaultTheme } from 'src/themes/presets/defaultTheme';
import { type LayoutRectangle, Dimensions } from 'react-native';

// Default Configuration
const defaultConfig: VideoPlayerConfig = {
  autoHideControls: true,
  autoHideDelay: 5000,
  autoPlay: true,
  enableGestures: true,
  enableFullscreen: true,
  enableVolumeControl: true,
  enableScreenRotation: false,
  playbackRates: [0.5, 1, 1.25, 1.5, 2],
  layout: 'default',
};

// State and Context
interface VideoProviderState extends VideoState {
  config: VideoPlayerConfig;
  theme: VideoTheme;
  videoRef: React.RefObject<any> | null;
  controlsOpacity: SharedValue<number> | null;
  hideTimeoutRef: NodeJS.Timeout | null;
  videoLayout: LayoutRectangle;
  dimensions: { width: number; height: number };
}

type Action =
  | { type: 'INITIALIZE'; payload: { theme?: Partial<VideoTheme>; config?: Partial<VideoPlayerConfig> } }
  | { type: 'SET_CONTROLS_OPACITY'; payload: SharedValue<number> }
  | { type: 'SET_VIDEO_REF'; payload: React.RefObject<any> }
  | { type: 'SHOW_CONTROLS' }
  | { type: 'HIDE_CONTROLS' }
  | { type: 'SEEK'; payload: number }
  | { type: 'TOGGLE_PLAY_PAUSE' }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'TOGGLE_FULLSCREEN' }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_BUFFERING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_HIDE_TIMEOUT'; payload: NodeJS.Timeout | null }
  | { type: 'SET_VIDEO_LAYOUT'; payload: LayoutRectangle }
  | { type: 'SET_DIMENSIONS'; payload: { width: number; height: number } };

const initialState: VideoProviderState = {
  isPlaying: defaultConfig.autoPlay,
  currentTime: 0,
  duration: 0,
  buffering: false,
  muted: false,
  volume: 1,
  playbackRate: 1,
  fullscreen: false,
  error: null,
  config: defaultConfig,
  theme: defaultTheme,
  videoRef: null,
  controlsOpacity: null,
  hideTimeoutRef: null,
  videoLayout: { x: 0, y: 0, width: 0, height: 0 },
  dimensions: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
};

const VideoContext = createContext<
  | {
      state: VideoProviderState;
      dispatch: React.Dispatch<Action>;
    }
  | undefined
>(undefined);

// Reducer
function videoReducer(state: VideoProviderState, action: Action): VideoProviderState {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        theme: {
          ...defaultTheme,
          ...action.payload.theme,
          colors: { ...defaultTheme.colors, ...action.payload.theme?.colors },
          sizing: { ...defaultTheme.sizing, ...action.payload.theme?.sizing },
          fonts: { ...defaultTheme.fonts, ...action.payload.theme?.fonts },
          fontSizes: { ...defaultTheme.fontSizes, ...action.payload.theme?.fontSizes },
          borderRadius: defaultTheme.borderRadius ?? action.payload.theme?.borderRadius,
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
    case 'TOGGLE_PLAY_PAUSE':
      return { ...state, isPlaying: !state.isPlaying };
    case 'SET_VOLUME':
      return { ...state, volume: Math.max(0, Math.min(1, action.payload)) };
    case 'TOGGLE_MUTE':
      return { ...state, muted: !state.muted };
    case 'TOGGLE_FULLSCREEN':
      return { ...state, fullscreen: !state.fullscreen };
    case 'SET_HIDE_TIMEOUT':
      return { ...state, hideTimeoutRef: action.payload };

    case 'SET_VIDEO_LAYOUT':
      return { ...state, videoLayout: action.payload };
    case 'SET_DIMENSIONS':
      return { ...state, dimensions: action.payload };
    default:
      return state;
  }
}

// Provider Component
export const VideoProvider: React.FC<{
  children: React.ReactNode;
  config?: Partial<VideoPlayerConfig>;
  theme?: Partial<VideoTheme>;
}> = ({ children, config, theme }) => {
  const [state, dispatch] = useReducer(videoReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'INITIALIZE', payload: { config, theme } });
  }, [config, theme]);

  return <VideoContext.Provider value={{ state, dispatch }}>{children}</VideoContext.Provider>;
};

// Hook to use the context
export const useVideo = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};
