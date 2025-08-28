import { useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { useVideo } from '../../providers';
import { runOnJS } from 'react-native-reanimated';
import type { UsePanGestureProps } from '../../types';

/**
 * A hook for handling pan gestures to control video playback.
 *
 * @param props - The properties for the hook.
 * @returns An object with the following properties:
 * - `verticalPanGesture`: The gesture handler for vertical pans.
 */
export const usePanGesture = ({ onLeftVerticalPan, onRightVerticalPan, onGlobalVerticalPan }: UsePanGestureProps) => {
  const { state } = useVideo();
  const { dimensions } = state;
  const verticalPanGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY([-10, 10])
        .onUpdate((event) => {
          'worklet';
          if (onGlobalVerticalPan) {
            runOnJS(onGlobalVerticalPan)(event);
            return;
          }
          const side = event.x < dimensions.width / 2 ? 'left' : 'right';
          if (side === 'left') {
            if (onLeftVerticalPan) runOnJS(onLeftVerticalPan)(event);
          } else {
            if (onRightVerticalPan) runOnJS(onRightVerticalPan)(event);
          }
        }),
    [onLeftVerticalPan, onRightVerticalPan, onGlobalVerticalPan, dimensions.width]
  );

  return {
    verticalPanGesture,
  };
};

export default usePanGesture;
