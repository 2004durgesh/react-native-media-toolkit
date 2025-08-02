import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useVideoActions } from '../../store';
import { runOnJS } from 'react-native-reanimated';

interface TapHandlerProps {
  children: React.ReactNode;
}

const TapHandler = ({ children }: TapHandlerProps) => {
  const { toggleControls } = useVideoActions();
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
