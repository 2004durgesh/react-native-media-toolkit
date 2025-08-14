import { useVideo } from '../../components/providers/VideoProvider';
import { useCallback } from 'react';

export const useVolume = () => {
  const { state, dispatch } = useVideo();

  const setVolume = useCallback((volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: volume });
  }, [dispatch]);

  const toggleMute = useCallback(() => {
    dispatch({ type: 'TOGGLE_MUTE' });
  }, [dispatch]);

  return {
    volume: state.volume,
    muted: state.muted,
    setVolume,
    toggleMute,
  };
};
