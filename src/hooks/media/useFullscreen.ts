import { useVideo } from '../../components/providers/VideoProvider';
import { useCallback } from 'react';

export const useFullscreen = () => {
  const { state, dispatch } = useVideo();

  const toggleFullscreen = useCallback(() => {
    dispatch({ type: 'TOGGLE_FULLSCREEN' });
  }, [dispatch]);

  return {
    fullscreen: state.fullscreen,
    toggleFullscreen,
  };
};
