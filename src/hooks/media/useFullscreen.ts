import { useVideo } from '../../providers';
import { useCallback } from 'react';
import { useControlsVisibility } from './useControlsVisibility';
import { NativeMediaToolkit } from '../../NativeMediaToolkit';
import RNOrientationDirector, { Orientation } from 'react-native-orientation-director';

export const useFullscreen = () => {
  const { state, dispatch } = useVideo();
  const { showControls } = useControlsVisibility();

  const toggleFullscreen = useCallback(async () => {
    dispatch({ type: 'TOGGLE_FULLSCREEN' });
    const newFullscreenState = !state.fullscreen;

    if (newFullscreenState) {
      showControls();
      if (state.config.enableScreenRotation) {
        RNOrientationDirector.lockTo(Orientation.landscape);
      }
      NativeMediaToolkit.enterFullscreen();
      console.log('Entering ', await NativeMediaToolkit.isFullscreen());
    } else if (state.hideTimeoutRef) {
      if (state.config.enableScreenRotation) {
        RNOrientationDirector.lockTo(Orientation.portrait);
      }
      console.log('exiting', await NativeMediaToolkit.isFullscreen());
      NativeMediaToolkit.exitFullscreen();
      clearTimeout(state.hideTimeoutRef!);
      showControls();
    }
  }, [dispatch, state.fullscreen, state.hideTimeoutRef, showControls, state.config.enableScreenRotation]);

  return {
    fullscreen: state.fullscreen,
    toggleFullscreen,
  };
};
