import { useVideo } from '../../components/providers/VideoProvider';
import { useCallback } from 'react';

export const useProgress = () => {
  const { state, dispatch } = useVideo();
  const { videoRef, duration } = state;

  const seek = useCallback((time: number) => {
    if (videoRef?.current) {
      const newTime = Math.max(0, Math.min(time, duration));
      videoRef.current.seek(newTime);
      dispatch({ type: 'SET_CURRENT_TIME', payload: newTime });
    }
  }, [videoRef, duration, dispatch]);

  const setCurrentTime = useCallback((time: number) => {
    dispatch({ type: 'SET_CURRENT_TIME', payload: time });
  }, [dispatch]);

  const setDuration = useCallback((duration: number) => {
    dispatch({ type: 'SET_DURATION', payload: duration });
  }, [dispatch]);

  return {
    currentTime: state.currentTime,
    duration: state.duration,
    seek,
    setCurrentTime,
    setDuration,
  };
};
