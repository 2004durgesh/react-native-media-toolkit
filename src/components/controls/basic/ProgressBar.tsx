import { useState, type FC } from 'react';
import { View, StyleSheet, type ViewStyle, type LayoutChangeEvent, type AccessibilityProps } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';
import { useVideo } from '@/store/videoStore';

interface ProgressBarProps extends AccessibilityProps {
  height?: number;
  trackColor?: string;
  progressColor?: string;
  thumbColor?: string;
  thumbSize?: number;
  style?: ViewStyle;
}

export const ProgressBar: FC<ProgressBarProps> = ({
  height = 4,
  trackColor,
  progressColor,
  thumbSize = 12,
  thumbColor,
  style,
  accessibilityLabel = 'Video progress bar',
}) => {
  // Use separate selectors to avoid creating new objects
  const currentTime = useVideo((state) => state.currentTime);
  const duration = useVideo((state) => state.duration);
  const buffering = useVideo((state) => state.buffering);
  const theme = useVideo((state) => state.theme);
  const seek = useVideo((state) => state.seek);
  const showControls = useVideo((state) => state.showControls);

  const [barWidth, setBarWidth] = useState(0);
  const isDragging = useSharedValue(false);
  const dragProgress = useSharedValue(0);

  const trackBg = trackColor ?? theme.colors.secondary;
  const progressBg = progressColor ?? theme.colors.primary;
  const thumbBg = thumbColor ?? theme.colors.primary;

  const onSeek = (newProgress: number) => {
    if (duration > 0) {
      seek(newProgress * duration);
      dragProgress.value = newProgress;
    }
  };

  const onSeekStart = () => {
    isDragging.value = true;
    // Show controls when user starts seeking
    showControls();
  };

  const onSeekEnd = () => {
    runOnJS(onSeek)(dragProgress.value);
    isDragging.value = false;
  };

  const onSeekUpdate = (progress: number) => {
    dragProgress.value = progress;
    runOnJS(onSeek)(progress);
  };

  // Create a tap gesture for quick seeking
  const tapGesture = Gesture.Tap().onEnd((event) => {
    if (barWidth > 0 && !buffering) {
      const progress = Math.max(0, Math.min(1, event.x / barWidth));
      runOnJS(onSeek)(progress);
      runOnJS(showControls)();
    }
  });

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      runOnJS(onSeekStart)();
    })
    .onChange((event) => {
      if (barWidth > 0) {
        const progress = Math.max(0, Math.min(1, event.x / barWidth));
        runOnJS(onSeekUpdate)(progress);
      }
    })
    .onEnd(() => {
      runOnJS(onSeekEnd)();
    });

  // Combine gestures
  const combinedGesture = Gesture.Race(panGesture, tapGesture);

  const onBarLayout = (event: LayoutChangeEvent) => {
    setBarWidth(event.nativeEvent.layout.width);
  };

  // Reanimated style for the progress bar width
  const progressAnimatedStyle = useAnimatedStyle(() => {
    const progress = isDragging.value ? dragProgress.value : duration > 0 ? currentTime / duration : 0;
    return {
      width: `${progress * 100}%`,
      height: isDragging.value ? height * 1.2 : height,
      backgroundColor: progressBg,
      borderRadius: height / 2,
    };
  }, [currentTime, duration, progressBg, height]);

  // Reanimated style for the track
  const trackAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: isDragging.value ? height * 1.2 : height,
      backgroundColor: trackBg,
      borderRadius: height / 2,
    };
  }, [height, trackBg]);

  // Reanimated style for the thumb position and size
  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const progress = isDragging.value ? dragProgress.value : duration > 0 ? currentTime / duration : 0;
    const scale = isDragging.value ? 1.3 : 0.8;
    const opacity = isDragging.value || duration === 0 ? 1 : 0.7;

    return {
      left: `${progress * 100}%`,
      transform: [{ translateX: -thumbSize / 2 }, { translateY: -thumbSize / 2 }, { scale }],
      width: thumbSize,
      height: thumbSize,
      backgroundColor: thumbBg,
      opacity,
      borderRadius: thumbSize / 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDragging.value ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: isDragging.value ? 4 : 2,
    };
  }, [currentTime, duration, thumbSize, thumbBg]);

  return (
    <View
      style={[styles.container, style]}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{
        min: 0,
        max: duration,
        now: currentTime,
        text: `${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60)
          .toString()
          .padStart(2, '0')} of ${Math.floor(duration / 60)}:${Math.floor(duration % 60)
          .toString()
          .padStart(2, '0')}`,
      }}>
      <GestureDetector gesture={combinedGesture}>
        <Animated.View style={styles.interactiveArea} onLayout={onBarLayout}>
          <Animated.View style={[styles.track, trackAnimatedStyle]} />
          <Animated.View style={[styles.progress, progressAnimatedStyle]} />
          {duration > 0 && <Animated.View style={[styles.thumb, thumbAnimatedStyle]} />}
          {buffering && <View style={[styles.bufferingIndicator, { backgroundColor: theme.colors.accent }]} />}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 12,
    justifyContent: 'center',
  },

  interactiveArea: {
    position: 'relative',
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  track: {
    width: '100%',
    position: 'absolute',
    alignSelf: 'center',
  },
  progress: {
    position: 'absolute',
    left: 0,
    alignSelf: 'center',
  },
  thumb: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
  },
  bufferingIndicator: {
    position: 'absolute',
    top: '50%',
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    transform: [{ translateY: -4 }],
  },
});
