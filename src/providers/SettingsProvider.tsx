import React, { createContext, useReducer, useContext } from 'react';
import type { AudioTrack, TextTrack, VideoTrack } from 'react-native-video';

/**
 * Represents the state of the SettingsProvider.
 */
interface SettingsProviderState {
  /**
   * Whether the settings menu is visible.
   */
  isSettingsMenuVisible: boolean;
  /**
   * The current video quality setting.
   */
  quality: VideoTrack | null;
  /**
   * The current audio track setting.
   */
  audioTrack: AudioTrack | null;
  /**
   * The current subtitle track setting.
   */
  subtitleTrack: TextTrack | null;
  /**
   * The current playback rate setting.
   */
  playbackRate: number;
}

/**
 * Represents the actions that can be dispatched to the settings reducer.
 */
type SettingsAction =
  | { type: 'TOGGLE_SETTINGS_MENU' }
  | { type: 'SET_QUALITY'; payload: VideoTrack | null }
  | { type: 'SET_AUDIO_TRACK'; payload: AudioTrack | null }
  | { type: 'SET_SUBTITLE_TRACK'; payload: TextTrack | null }
  | { type: 'SET_PLAYBACK_RATE'; payload: number }
  | { type: 'OPEN_SETTINGS_SHEET' }
  | { type: 'CLOSE_SETTINGS_SHEET' };

/**
 * The initial state for the SettingsProvider.
 */
const initialSettingsState: SettingsProviderState = {
  isSettingsMenuVisible: false,
  quality: null,
  audioTrack: null,
  subtitleTrack: null,
  playbackRate: 1,
};

/**
 * The reducer for the settings state.
 */
function settingsReducer(state: SettingsProviderState, action: SettingsAction): SettingsProviderState {
  switch (action.type) {
    case 'TOGGLE_SETTINGS_MENU':
      return { ...state, isSettingsMenuVisible: !state.isSettingsMenuVisible };
    case 'SET_QUALITY':
      return { ...state, quality: action.payload };
    case 'SET_AUDIO_TRACK':
      return { ...state, audioTrack: action.payload };
    case 'SET_SUBTITLE_TRACK':
      return { ...state, subtitleTrack: action.payload };
    case 'SET_PLAYBACK_RATE':
      return { ...state, playbackRate: action.payload };
    case 'OPEN_SETTINGS_SHEET':
      return { ...state, isSettingsMenuVisible: true };
    case 'CLOSE_SETTINGS_SHEET':
      return { ...state, isSettingsMenuVisible: false };
    default:
      return state;
  }
}

/**
 * The context for the video player settings.
 */
const SettingsContext = createContext<
  | {
      state: SettingsProviderState;
      dispatch: React.Dispatch<SettingsAction>;
    }
  | undefined
>(undefined);

/**
 * The provider component for the video player settings.
 * This component provides the settings state to all its children.
 */
export const SettingsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialSettingsState);

  return <SettingsContext.Provider value={{ state, dispatch }}>{children}</SettingsContext.Provider>;
};

/**
 * A hook to use the settings context.
 * This hook provides access to the settings state and dispatch function.
 */
export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
};
