import { useControlsVisibility } from '../hooks';
import React, { useCallback, useMemo, useRef, useState, type FC } from 'react';
import { Dimensions, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { GestureDetector, Gesture, type ComposedGesture, type TapGesture } from 'react-native-gesture-handler';
import Animated, {
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useVideo } from 'src/providers';
import type { Component } from 'react';

interface TapHandlerProps {
  isLocked?: boolean;
  seekInterval?: number;
  onSeekStart?: () => void;
  onSeekEnd?: () => void;
  children?: React.ReactNode;
}

export const SeekText: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Text style={styles.seekText}>{children}</Text>;
};

export const OverlayedView = React.forwardRef<
  Component,
  {
    children: React.ReactNode;
    style: StyleProp<ViewStyle>;
  }
>(({ children, style }, ref) => {
  return (
    <Animated.View ref={ref} style={[styles.overlayedView, style]}>
      {children}
    </Animated.View>
  );
});

export const TapHandler: FC<TapHandlerProps> = ({
  isLocked = false,
  seekInterval = 10,
  onSeekStart,
  onSeekEnd,
  children,
}) => {
  const {
    state: { videoRef },
    state,
  } = useVideo();
  const [isDoubleTap, setIsDoubleTap] = useState(false);
  const [doubleTapValue, setDoubleTapValue] = useState({ forward: 0, backward: 0 });
  const lastTap = useRef(0);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tapCount = useSharedValue(0);
  const forwardOpacity = useSharedValue(0);
  const backwardOpacity = useSharedValue(0);
  const scaleValue = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0.3);
  const boxWidth = useSharedValue(0);
  const boxHeight = useSharedValue(0);

  const consecutiveTapCount = useRef({
    forward: 0,
    backward: 0,
    lastDirection: null as 'forward' | 'backward' | null,
    lastTapTime: 0,
  });

  const activeDirection = useSharedValue<'forward' | 'backward' | null>(null);
  const forwardRippleRef = useAnimatedRef();
  const backwardRippleRef = useAnimatedRef();

  const resetConsecutiveCount = useCallback(
    (direction: 'forward' | 'backward') => {
      consecutiveTapCount.current = {
        forward: 0,
        backward: 0,
        lastDirection: null,
        lastTapTime: 0,
      };
      setDoubleTapValue((prev) => ({
        ...prev,
        [direction]: seekInterval,
      }));
    },
    [seekInterval]
  );
  const showTapAnimation = useCallback(
    (direction: 'forward' | 'backward') => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      const animationValue = direction === 'forward' ? forwardOpacity : backwardOpacity;

      animationValue.value = withSequence(withSpring(1), withTiming(0, { duration: 250 }));

      scaleValue.value = withSequence(withSpring(1.2), withSpring(1));

      animationTimeoutRef.current = setTimeout(() => {
        runOnJS(resetConsecutiveCount)(direction);
      }, 1000);
    },
    [forwardOpacity, backwardOpacity, scaleValue, resetConsecutiveCount]
  );

  const handleSeek = useCallback(
    async (direction: 'forward' | 'backward') => {
      if (!videoRef?.current) return;

      const now = Date.now();
      const timeSinceLastTap = now - consecutiveTapCount.current.lastTapTime;
      const isConsecutive = timeSinceLastTap < 500 && direction === consecutiveTapCount.current.lastDirection;

      try {
        const currentTime = await videoRef.current.getCurrentPosition();
        const seekAmount = direction === 'forward' ? seekInterval : -seekInterval;
        const newPosition = Math.max(currentTime + seekAmount, 0);

        videoRef.current.seek(newPosition);

        if (isConsecutive) {
          consecutiveTapCount.current[direction]++;
          setDoubleTapValue((prev) => ({
            ...prev,
            [direction]: seekInterval * (consecutiveTapCount.current[direction] + 1),
          }));
        } else {
          consecutiveTapCount.current = {
            forward: 0,
            backward: 0,
            lastDirection: direction,
            lastTapTime: now,
          };
          setDoubleTapValue((prev) => ({
            ...prev,
            [direction]: seekInterval,
          }));
        }

        consecutiveTapCount.current.lastDirection = direction;
        consecutiveTapCount.current.lastTapTime = now;

        runOnJS(showTapAnimation)(direction);
      } catch (error) {
        console.error('Seek failed:', error);
      }
    },
    [videoRef, seekInterval, showTapAnimation]
  );

  const doubleTapGesture = useMemo(
    () =>
      Gesture.Tap()
        .numberOfTaps(2)
        .maxDuration(250)
        .onStart((event) => {
          if (isLocked) return;

          const now = Date.now();
          const timeSinceLastTap = now - lastTap.current;
          lastTap.current = now;

          if (timeSinceLastTap > 500) {
            tapCount.value = 0;
          }

          runOnJS(setIsDoubleTap)(true);
          if (onSeekStart) {
            runOnJS(onSeekStart)();
          }

          const touchX = event.absoluteX;
          const screenMidPoint = Dimensions.get('window').width / 2;
          const direction = touchX < screenMidPoint ? 'backward' : 'forward';
          activeDirection.value = direction;

          // Store the actual touch coordinates
          translateX.value = event.x;
          translateY.value = event.y;
          rippleScale.value = 0;
          rippleScale.value = withTiming(1, { duration: 500 });
          rippleOpacity.value = 0.4;

          runOnJS(handleSeek)(direction);
        })
        .onEnd(() => {
          runOnJS(setIsDoubleTap)(false);
          if (onSeekEnd) {
            runOnJS(onSeekEnd)();
          }
          rippleOpacity.value = withTiming(0, { duration: 500 });
          console.log('double tap');
        })
        .runOnJS(true),
    [
      isLocked,
      onSeekStart,
      activeDirection,
      translateX,
      translateY,
      rippleScale,
      rippleOpacity,
      handleSeek,
      tapCount,
      onSeekEnd,
    ]
  );

  const backwardAnimatedRipple = useAnimatedStyle(() => {
    if (activeDirection.value !== 'backward') {
      return { opacity: 0 };
    }
    const boxLayout = measure(backwardRippleRef);
    if (!boxLayout) return { opacity: 0 };

    if (boxLayout) {
      boxWidth.value = boxLayout.width;
      boxHeight.value = boxLayout.height;
    }

    const radius = Math.sqrt(boxWidth.value ** 2 + boxHeight.value ** 2);
    const width = radius * 2;
    const height = radius * 2;

    return {
      width,
      height,
      borderRadius: radius,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1,
      opacity: rippleOpacity.value,
      transform: [
        { translateX: translateX.value - radius },
        { translateY: translateY.value - radius },
        { scale: rippleScale.value },
      ],
    };
  });

  const forwardAnimatedRipple = useAnimatedStyle(() => {
    if (activeDirection.value !== 'forward') {
      return { opacity: 0 };
    }
    const boxLayout = measure(forwardRippleRef);
    if (!boxLayout) return { opacity: 0 };

    if (boxLayout) {
      boxWidth.value = boxLayout.width;
      boxHeight.value = boxLayout.height;
    }

    const radius = Math.sqrt(boxWidth.value ** 2 + boxHeight.value ** 2);
    const width = radius * 2;
    const height = radius * 2;

    // Use the actual touch coordinates for forward ripple too
    return {
      width,
      height,
      borderRadius: radius,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1,
      opacity: rippleOpacity.value,
      transform: [
        { translateX: translateX.value - radius },
        { translateY: translateY.value - radius },
        { scale: rippleScale.value },
      ],
    };
  });

  const useDirectionalStyle = (opacityValue: Animated.SharedValue<number>) =>
    useAnimatedStyle(() => ({
      opacity: opacityValue.value,
      transform: [{ scale: scaleValue.value }],
    }));

  const forwardAnimatedStyle = useDirectionalStyle(forwardOpacity);
  const backwardAnimatedStyle = useDirectionalStyle(backwardOpacity);

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

  let composedGesture: ComposedGesture | TapGesture;
  if (state.config.enableDoubleTapGestures) {
    composedGesture = Gesture.Exclusive(doubleTapGesture, singleTapGesture);
  } else {
    composedGesture = singleTapGesture;
  }
  return (
    <GestureDetector gesture={composedGesture}>
      <View style={StyleSheet.absoluteFill}>
        <OverlayedView ref={backwardRippleRef} style={{ left: 0 }}>
          <Animated.View style={[backwardAnimatedRipple]}>
            <SeekText>-{doubleTapValue.backward}s</SeekText>
          </Animated.View>
        </OverlayedView>
        <OverlayedView ref={forwardRippleRef} style={{ right: 0 }}>
          <Animated.View style={[forwardAnimatedRipple]}>
            <SeekText>+{doubleTapValue.forward}s</SeekText>
          </Animated.View>
        </OverlayedView>
        {children}
      </View>
    </GestureDetector>
  );
};

export default TapHandler;

const styles = StyleSheet.create({
  seekText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
  },
  overlayedView: {
    position: 'absolute',
    top: 0,
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
    zIndex: 10,
    overflow: 'hidden',
    borderRadius: '50%',
    transform: [{ scale: 1.5 }],
    // backgroundColor: 'red', //for debugging purposes
  },
});
