import { useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { useVideo } from '../../providers';
import { runOnJS } from 'react-native-reanimated';
import type { UsePanGestureProps } from '../../types';

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
