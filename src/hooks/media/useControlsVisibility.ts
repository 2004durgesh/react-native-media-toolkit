import { withTiming, type SharedValue } from 'react-native-reanimated';
import { useVideo } from '../../providers';
import { useCallback } from 'react';

/**
 * A hook for controlling the visibility of the video controls.
 *
 * @returns An object with the following properties:
 * - `showControls`: A function to show the controls.
 * - `hideControls`: A function to hide the controls.
 * - `toggleControls`: A function to toggle the visibility of the controls.
 * - `setOpacity`: A function to set the opacity of the controls.
 */
export const useControlsVisibility = () => {
  const { state, dispatch } = useVideo();
  const { controlsOpacity, theme, config, isPlaying, hideTimeoutRef } = state;

  /**
   * Hides the video controls.
   */
  const hideControls = useCallback(() => {
    if (controlsOpacity) {
      controlsOpacity.value = withTiming(0, {
        duration: theme.animations.normal,
      });
    }
    state.config.onHideControls?.();
  }, [controlsOpacity, theme, state.config]);

  /**
   * Shows the video controls.
   */
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

  /**
   * Toggles the visibility of the video controls.
   */
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

  /**
   * Sets the opacity of the video controls.
   * @param opacity - The opacity to set.
   */
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
