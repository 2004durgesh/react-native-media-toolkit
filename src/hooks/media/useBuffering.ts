import { useVideo } from '../../providers';
import { useCallback } from 'react';

export const useBuffering = () => {
  const { state, dispatch } = useVideo();

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
