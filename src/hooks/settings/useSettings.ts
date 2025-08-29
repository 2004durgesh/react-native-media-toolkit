import type { AudioTrack, TextTrack, VideoTrack } from 'react-native-video';
import { useSettingsContext, useBottomSheet } from '../../providers';
import { useCallback, useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

/**
 * A hook for managing video settings like quality, audio tracks, and subtitles.
 *
 * @returns An object with the following properties:
 * - `quality`: The current video quality setting.
 * - `setQuality`: A function to set the video quality.
 * - `audioTrack`: The current audio track setting.
 * - `setAudioTrack`: A function to set the audio track.
 * - `subtitleTrack`: The current subtitle track setting.
 * - `setSubtitleTrack`: A function to set the subtitle track.
 */
export const useSettings = () => {
  const { state, dispatch } = useSettingsContext();
  const { open, close } = useBottomSheet();

  /**
   * Toggles the playback state of the video.
   */
  const toggleSettingsMenu = useCallback(() => {
    dispatch({ type: 'TOGGLE_SETTINGS_MENU' });
    const newSettingsMenuState = !state.isSettingsMenuVisible;

    if (newSettingsMenuState) {
      open(state.settingsBottomSheetContent);
    } else {
      close();
    }
  }, [dispatch, state.isSettingsMenuVisible, open, close, state.settingsBottomSheetContent]);

  /**
   * Sets the video quality.
   * @param newQuality - The new video quality (e.g., 'auto', '1080p', '720p').
   */
  const setQuality = useCallback(
    (newQuality: VideoTrack | null) => {
      dispatch({ type: 'SET_QUALITY', payload: newQuality });
    },
    [dispatch]
  );

  /**
   * Sets the audio track.
   * @param newAudioTrack - The new audio track (e.g., 'english', 'spanish').
   */
  const setAudioTrack = useCallback(
    (newAudioTrack: AudioTrack | null) => {
      dispatch({ type: 'SET_AUDIO_TRACK', payload: newAudioTrack });
    },
    [dispatch]
  );

  /**
   * Sets the subtitle track.
   * @param newSubtitleTrack - The new subtitle track (e.g., 'off', 'english', 'french').
   */
  const setSubtitleTrack = useCallback(
    (newSubtitleTrack: TextTrack | null) => {
      dispatch({ type: 'SET_SUBTITLE_TRACK', payload: newSubtitleTrack });
    },
    [dispatch]
  );

  const settingsTapGesture = useMemo(
    () =>
      Gesture.Tap()
        .maxDuration(250)
        .numberOfTaps(1)
        .onEnd(() => {
          'worklet';
          runOnJS(toggleSettingsMenu)();
        }),
    [toggleSettingsMenu]
  );

  return {
    quality: state.quality,
    setQuality,
    audioTrack: state.audioTrack,
    setAudioTrack,
    subtitleTrack: state.subtitleTrack,
    setSubtitleTrack,
    isSettingsMenuVisible: state.isSettingsMenuVisible,
    toggleSettingsMenu,
    settingsTapGesture,
  };
};
