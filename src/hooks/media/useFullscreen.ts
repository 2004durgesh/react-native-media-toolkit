import { useVideo } from '../../providers';
import { useCallback } from 'react';
import { useControlsVisibility } from './useControlsVisibility';
import { NativeMediaToolkit } from '../../NativeMediaToolkit';
import RNOrientationDirector, { Orientation } from 'react-native-orientation-director';

export const useFullscreen = () => {
  const { state, dispatch } = useVideo();
  const { showControls } = useControlsVisibility();

  const toggleFullscreen = useCallback(() => {
    dispatch({ type: 'TOGGLE_FULLSCREEN' });
    const newFullscreenState = !state.fullscreen;

    if (newFullscreenState) {
      showControls();
      RNOrientationDirector.lockTo(Orientation.landscape);
      console.log(state.videoLayout);
      NativeMediaToolkit.enterFullscreen();
    } else if (state.hideTimeoutRef) {
      NativeMediaToolkit.exitFullscreen();
      RNOrientationDirector.lockTo(Orientation.portrait);
      console.log(state.videoLayout);
      clearTimeout(state.hideTimeoutRef!);
      showControls();
    }
  }, [dispatch, state.fullscreen, state.hideTimeoutRef, showControls, state.videoLayout]);

  return {
    fullscreen: state.fullscreen,
    toggleFullscreen,
  };
};
