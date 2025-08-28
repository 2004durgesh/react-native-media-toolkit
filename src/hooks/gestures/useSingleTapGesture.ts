import { useMemo } from 'react';
import { useControlsVisibility } from '../media';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

/**
 * A hook for handling single tap gestures to toggle the visibility of the video controls.
 *
 * @returns An object with the following properties:
 * - `singleTapGesture`: The gesture handler for single taps.
 */
export const useSingleTapGesture = () => {
  const { toggleControls } = useControlsVisibility();
  const singleTapGesture = useMemo(
    () =>
      Gesture.Tap()
        .maxDuration(250)
        .numberOfTaps(1)
        .onEnd(() => {
          'worklet';
          runOnJS(toggleControls)();
        }),
    [toggleControls]
  );
  return { singleTapGesture };
};

export default useSingleTapGesture;
