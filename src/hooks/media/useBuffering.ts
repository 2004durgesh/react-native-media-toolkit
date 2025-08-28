import { useVideo } from '../../providers';
import { useCallback } from 'react';

/**
 * A hook for controlling video buffering.
 *
 * @returns An object with the following properties:
 * - `buffering`: A boolean indicating whether the video is currently buffering.
 * - `setBuffering`: A function to set the buffering state of the video.
 */
export const useBuffering = () => {
  const { state, dispatch } = useVideo();

  /**
   * Sets the buffering state of the video.
   * @param isBuffering - A boolean indicating whether the video is buffering.
   */
  const setBuffering = useCallback(
    (isBuffering: boolean) => {
      dispatch({ type: 'SET_BUFFERING', payload: isBuffering });
    },
    [dispatch]
  );

  return {
    buffering: state.buffering,
    setBuffering,
  };
};
