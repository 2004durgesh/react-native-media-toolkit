import { useVideo } from '../../providers';
import { useCallback } from 'react';

/**
 * A hook for controlling video progress.
 *
 * @returns An object with the following properties:
 * - `currentTime`: The current time of the video in seconds.
 * - `duration`: The duration of the video in seconds.
 * - `seek`: A function to seek to a specific time in the video.
 * - `setCurrentTime`: A function to set the current time of the video.
 * - `setDuration`: A function to set the duration of the video.
 */
export const useProgress = () => {
  const { state, dispatch } = useVideo();
  const { videoRef, duration } = state;

  /**
   * Seeks to a specific time in the video.
   * @param time - The time to seek to in seconds.
   */
  const seek = useCallback(
    (time: number) => {
      if (videoRef?.current) {
        const newTime = Math.max(0, Math.min(time, duration));
        videoRef.current.seek(newTime);
        dispatch({ type: 'SET_CURRENT_TIME', payload: newTime });
      }
    },
    [videoRef, duration, dispatch]
  );

  /**
   * Sets the current time of the video.
   * @param time - The time to set in seconds.
   */
  const setCurrentTime = useCallback(
    (time: number) => {
      dispatch({ type: 'SET_CURRENT_TIME', payload: time });
    },
    [dispatch]
  );

  /**
   * Sets the duration of the video.
   * @param duration - The duration to set in seconds.
   */
  const setDuration = useCallback(
    (duration: number) => {
      dispatch({ type: 'SET_DURATION', payload: duration });
    },
    [dispatch]
  );

  return {
    currentTime: state.currentTime,
    duration: state.duration,
    seek,
    setCurrentTime,
    setDuration,
  };
};
