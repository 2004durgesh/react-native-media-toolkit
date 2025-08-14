import React, { useMemo, type FC } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { useControlsVisibility } from '../hooks';

interface TapHandlerProps {
  children: React.ReactNode;
}

export const TapHandler: FC<TapHandlerProps> = ({ children }) => {
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
  return (
    <GestureDetector gesture={singleTapGesture}>
      <View style={{ height: '100%', width: '100%' }}>{children}</View>
    </GestureDetector>
  );
};

export default TapHandler;
