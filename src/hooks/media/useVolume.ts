import { useVideo } from '../../providers';
import { useCallback } from 'react';
import { useControlsVisibility } from './useControlsVisibility';

export const useVolume = () => {
  const { state, dispatch } = useVideo();
  const { showControls } = useControlsVisibility();

  const setVolume = useCallback(
    (volume: number) => {
      dispatch({ type: 'SET_VOLUME', payload: volume });
    },
    [dispatch]
  );

  const toggleMute = useCallback(() => {
    dispatch({ type: 'TOGGLE_MUTE' });
    const newMutedState = !state.muted;
    if (newMutedState) {
      showControls();
    } else if (state.hideTimeoutRef) {
      clearTimeout(state.hideTimeoutRef!);
      showControls();
    }
  }, [dispatch, , state.muted, state.hideTimeoutRef, showControls]);

  return {
    volume: state.volume,
    muted: state.muted,
    setVolume,
    toggleMute,
  };
};
