import { useVideo } from '../../providers';
import { useCallback } from 'react';
import { useControlsVisibility } from './useControlsVisibility';

export const useFullscreen = () => {
  const { state, dispatch } = useVideo();
  const { showControls } = useControlsVisibility();

  const toggleFullscreen = useCallback(() => {
    dispatch({ type: 'TOGGLE_FULLSCREEN' });
    const newFullscreenState = !state.fullscreen;

    if (newFullscreenState) {
      showControls();
    } else if (state.hideTimeoutRef) {
      clearTimeout(state.hideTimeoutRef!);
      showControls();
    }
  }, [dispatch, state.fullscreen, state.hideTimeoutRef, showControls]);

  return {
    fullscreen: state.fullscreen,
    toggleFullscreen,
  };
};
