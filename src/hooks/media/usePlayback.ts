import { useVideo } from '../../components/providers/VideoProvider';
import { useControlsVisibility } from './useControlsVisibility';
import { useCallback } from 'react';

export const usePlayback = () => {
  const { state, dispatch } = useVideo();
  const { showControls } = useControlsVisibility();

  const togglePlayPause = useCallback(() => {
    dispatch({ type: 'TOGGLE_PLAY_PAUSE' });
    const newPlayingState = !state.isPlaying;

    if (newPlayingState) {
      showControls();
    } else if (state.hideTimeoutRef) {
      clearTimeout(state.hideTimeoutRef!);
      showControls();
    }
  }, [dispatch, state.isPlaying, state.hideTimeoutRef, showControls]);
  
  const setPlaying = useCallback((isPlaying: boolean) => {
    dispatch({ type: 'SET_PLAYING', payload: isPlaying });
  }, [dispatch]);

  return {
    isPlaying: state.isPlaying,
    togglePlayPause,
    setPlaying,
  };
};
