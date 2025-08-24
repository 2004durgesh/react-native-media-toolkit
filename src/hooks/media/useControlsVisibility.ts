import { withTiming, type SharedValue } from 'react-native-reanimated';
import { useVideo } from '../../providers';
import { useCallback } from 'react';

export const useControlsVisibility = () => {
  const { state, dispatch } = useVideo();
  const { controlsOpacity, theme, config, isPlaying, hideTimeoutRef } = state;

  const hideControls = useCallback(() => {
    if (controlsOpacity) {
      controlsOpacity.value = withTiming(0, {
        duration: theme.animations.normal,
      });
    }
    state.config.onHideControls?.();
  }, [controlsOpacity, theme, state.config]);

  const showControls = useCallback(() => {
    if (hideTimeoutRef) {
      clearTimeout(hideTimeoutRef);
    }

    if (controlsOpacity) {
      controlsOpacity.value = withTiming(1, {
        duration: theme.animations.fast,
      });
    }

    if (config.autoHideControls && isPlaying) {
      const newTimeout = setTimeout(() => hideControls(), config.autoHideDelay);
      dispatch({ type: 'SET_HIDE_TIMEOUT', payload: newTimeout as unknown as NodeJS.Timeout });
    }
    state.config.onShowControls?.();
  }, [hideTimeoutRef, controlsOpacity, theme, config, isPlaying, dispatch, hideControls, state.config]);

  const toggleControls = useCallback(() => {
    if (controlsOpacity) {
      const isVisible = controlsOpacity.value > 0.5;
      if (isVisible) {
        hideControls();
      } else {
        showControls();
      }
    } else {
      showControls();
    }
  }, [controlsOpacity, hideControls, showControls]);

  const setOpacity = useCallback(
    (opacity: SharedValue<number>) => {
      dispatch({ type: 'SET_CONTROLS_OPACITY', payload: opacity });
    },
    [dispatch]
  );

  return {
    showControls,
    hideControls,
    toggleControls,
    setOpacity,
  };
};
