import { useVideo } from '../../components/providers/VideoProvider';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
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

interface DoubleTapGestureProps {
  isLocked?: boolean;
  seekInterval?: number;
  onSeekStart?: () => void;
  onSeekEnd?: () => void;
  children?: React.ReactNode;
}

export const DoubleTapGesture: React.FC<DoubleTapGestureProps> = ({
  isLocked = false,
  seekInterval = 10,
  onSeekStart,
  onSeekEnd,
  children,
}) => {
  const {
    state: { videoRef },
  } = useVideo();
  const [isDoubleTap, setIsDoubleTap] = useState(false);
  const [doubleTapValue, setDoubleTapValue] = useState({ forward: 0, backward: 0 });
  console.log(isDoubleTap, doubleTapValue);
  const lastTap = useRef(0);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const resetConsecutiveCount = useCallback(() => {
    consecutiveTapCount.current = {
      forward: 0,
      backward: 0,
      lastDirection: null,
      lastTapTime: 0,
    };
    setDoubleTapValue({ forward: 0, backward: 0 });
  }, []);

  const showTapAnimation = useCallback(
    (direction: 'forward' | 'backward') => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);

      const animationValue = direction === 'forward' ? forwardOpacity : backwardOpacity;

      animationValue.value = withSequence(withSpring(1), withTiming(0, { duration: 250 }));
      scaleValue.value = withSequence(withSpring(1.2), withSpring(1));

      animationTimeoutRef.current = setTimeout(() => {
        runOnJS(resetConsecutiveCount)();
      }, 1000);
    },
    [backwardOpacity, forwardOpacity, resetConsecutiveCount, scaleValue]
  );

  const handleSeek = useCallback(
    async (direction: 'forward' | 'backward') => {
      if (!videoRef?.current) return;

      const now = Date.now();
      const timeSinceLastTap = now - consecutiveTapCount.current.lastTapTime;
      const isConsecutive = timeSinceLastTap < 500 && direction === consecutiveTapCount.current.lastDirection;

      try {
        const currentTime = await videoRef.current.getCurrentPosition?.();
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
          setDoubleTapValue((prev) => ({ ...prev, [direction]: seekInterval }));
        }

        consecutiveTapCount.current.lastDirection = direction;
        consecutiveTapCount.current.lastTapTime = now;
        runOnJS(showTapAnimation)(direction);
      } catch (e) {
        console.error('Seek failed:', e);
      }
    },
    [videoRef, seekInterval, showTapAnimation]
  );

  const doubleTapGesture = useMemo(() => {
    return Gesture.Tap()
      .numberOfTaps(2)
      .maxDuration(250)
      .onStart((event) => {
        if (isLocked) return;

        const now = Date.now();
        if (now - lastTap.current > 500) lastTap.current = now;

        runOnJS(setIsDoubleTap)(true);
        if (onSeekStart) runOnJS(onSeekStart)();

        const screenMid = Dimensions.get('window').width / 2;
        const direction = event.absoluteX < screenMid ? 'backward' : 'forward';
        activeDirection.value = direction;
        translateX.value = event.x;
        translateY.value = event.y;

        rippleScale.value = 0;
        rippleScale.value = withTiming(1, { duration: 500 });
        rippleOpacity.value = 0.4;

        runOnJS(handleSeek)(direction);
      })
      .onEnd(() => {
        runOnJS(setIsDoubleTap)(false);
        if (onSeekEnd) runOnJS(onSeekEnd)();
        rippleOpacity.value = withTiming(0, { duration: 500 });
      })
      .runOnJS(true);
  }, [
    isLocked,
    onSeekStart,
    activeDirection,
    translateX,
    translateY,
    rippleScale,
    rippleOpacity,
    handleSeek,
    onSeekEnd,
  ]);

  const forwardRipple = useAnimatedStyle(() => {
    if (activeDirection.value !== 'forward') return { opacity: 0 };

    const layout = measure(forwardRippleRef);
    if (!layout) return { opacity: 0 };

    boxWidth.value = layout.width;
    boxHeight.value = layout.height;

    const radius = Math.sqrt(boxWidth.value ** 2 + boxHeight.value ** 2);
    const width = radius * 2;
    const height = radius * 2;

    return {
      width,
      height,
      borderRadius: radius,
      backgroundColor: 'white',
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

  const backwardRipple = useAnimatedStyle(() => {
    if (activeDirection.value !== 'backward') return { opacity: 0 };

    const layout = measure(backwardRippleRef);
    if (!layout) return { opacity: 0 };

    boxWidth.value = layout.width;
    boxHeight.value = layout.height;

    const radius = Math.sqrt(boxWidth.value ** 2 + boxHeight.value ** 2);
    const width = radius * 2;
    const height = radius * 2;

    return {
      width,
      height,
      borderRadius: radius,
      backgroundColor: 'white',
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

  const forwardStyle = useAnimatedStyle(() => ({
    opacity: forwardOpacity.value,
    transform: [{ scale: scaleValue.value }],
  }));

  const backwardStyle = useAnimatedStyle(() => ({
    opacity: backwardOpacity.value,
    transform: [{ scale: scaleValue.value }],
  }));

  return (
    <GestureDetector gesture={doubleTapGesture}>
      <View style={StyleSheet.absoluteFill}>
        <Animated.View ref={backwardRippleRef} style={backwardRipple} />
        <Animated.View ref={forwardRippleRef} style={forwardRipple} />
        <Animated.View style={backwardStyle} />
        <Animated.View style={forwardStyle} />
        {children}
      </View>
    </GestureDetector>
  );
};

export default DoubleTapGesture;
