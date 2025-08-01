import { useState, type FC } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useVideo } from '@/store/videoStore';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS } from 'react-native-reanimated';

interface ProgressBarProps {
  height?: number;
  trackColor?: string;
  progressColor?: string;
  thumbColor?: string;
  thumbSize?: number;
  style?: any;
}

export const ProgressBar: FC<ProgressBarProps> = ({
  height = 4,
  trackColor,
  progressColor,
  thumbColor,
  thumbSize = 12,
  style,
}) => {
  // Use separate selectors to avoid creating new objects
  const currentTime = useVideo((state) => state.currentTime);
  const duration = useVideo((state) => state.duration);
  const theme = useVideo((state) => state.theme);
  const seek = useVideo((state) => state.seek);

  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);

  const trackBg = trackColor || theme.colors.secondary;
  const progressBg = progressColor || theme.colors.primary;
  const thumbBg = thumbColor || theme.colors.primary;

  const progress = isDragging ? dragProgress : duration > 0 ? currentTime / duration : 0;
  const { width: screenWidth } = Dimensions.get('window');
  const barWidth = screenWidth - theme.spacing.md * 2;

  const updateProgress = (newProgress: number) => {
    setDragProgress(newProgress);
  };

  const seekToPosition = (finalProgress: number) => {
    seek(finalProgress * duration);
    setIsDragging(false);
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      runOnJS(setIsDragging)(true);
    })
    .onUpdate((event) => {
      const newProgress = Math.max(0, Math.min(1, event.x / barWidth));
      runOnJS(updateProgress)(newProgress);
    })
    .onEnd(() => {
      runOnJS(seekToPosition)(dragProgress);
    });

  return (
    <View style={[styles.container, style]}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={styles.progressBarContainer}>
          <View style={[styles.track, { height: isDragging ? height * 1.5 : height, backgroundColor: trackBg }]} />
          <View
            style={[
              styles.progress,
              { width: `${progress * 100}%`, height: isDragging ? height * 1.5 : height, backgroundColor: progressBg },
            ]}
          />
          <View
            style={[
              styles.thumb,
              {
                left: `${progress * 100}%`,
                width: thumbSize,
                height: thumbSize,
                backgroundColor: thumbBg,
                opacity: isDragging ? 1 : 0,
              },
            ]}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 10,
    justifyContent: 'center',
  },
  progressBarContainer: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
  },
  track: {
    width: '100%',
    borderRadius: 2,
    position: 'absolute',
  },
  progress: {
    borderRadius: 2,
    position: 'absolute',
  },
  thumb: {
    position: 'absolute',
    borderRadius: 50,
    marginLeft: -6, // Half of thumb size to center it
    marginTop: -4, // Adjust vertical position
  },
});
