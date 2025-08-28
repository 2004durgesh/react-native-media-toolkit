import { useVideo } from '../../providers';
import { useCallback } from 'react';
import { useControlsVisibility } from './useControlsVisibility';
import { NativeVideoToolkit } from '../../NativeVideoToolkit';
import RNOrientationDirector, { Orientation } from 'react-native-orientation-director';

/**
 * A hook for controlling fullscreen mode.
 *
 * @returns An object with the following properties:
 * - `fullscreen`: A boolean indicating whether the video is in fullscreen mode.
 * - `toggleFullscreen`: A function to toggle fullscreen mode.
 */
export const useFullscreen = () => {
  const { state, dispatch } = useVideo();
  const { showControls } = useControlsVisibility();

  /**
   * Toggles the fullscreen mode of the video.
   */
  const toggleFullscreen = useCallback(async () => {
    dispatch({ type: 'TOGGLE_FULLSCREEN' });
    const newFullscreenState = !state.fullscreen;

    if (newFullscreenState) {
      showControls();
      if (state.config.enableScreenRotation) {
        RNOrientationDirector.lockTo(Orientation.landscape);
      }
      NativeVideoToolkit.enterFullscreen();
      state.config.onEnterFullscreen?.();
    } else if (state.hideTimeoutRef) {
      if (state.config.enableScreenRotation) {
        RNOrientationDirector.lockTo(Orientation.portrait);
      }
      NativeVideoToolkit.exitFullscreen();
      state.config.onExitFullscreen?.();
      clearTimeout(state.hideTimeoutRef!);
      showControls();
    }
  }, [dispatch, state.fullscreen, state.hideTimeoutRef, showControls, state.config]);

  return {
    fullscreen: state.fullscreen,
    toggleFullscreen,
  };
};
