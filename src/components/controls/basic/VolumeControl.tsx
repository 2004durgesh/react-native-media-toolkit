import { View, StyleSheet } from 'react-native';
import { useVideo } from '@/store/videoStore';
import type { FC } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

export interface VolumeControlProps {
  orientation?: 'horizontal' | 'vertical';
  width?: number;
  height?: number;
  trackColor?: string;
  progressColor?: string;
  style?: any;
}

export const VolumeControl: FC<VolumeControlProps> = ({
  orientation = 'horizontal',
  width = 100,
  height = 4,
  trackColor,
  progressColor,
  style,
}) => {
  // Use separate selectors to avoid creating new objects
  const volume = useVideo((state) => state.volume);
  const theme = useVideo((state) => state.theme);
  const setVolume = useVideo((state) => state.setVolume);

  const updateVolume = (newVolume: number) => {
    setVolume(newVolume);
  };

  const panGesture = Gesture.Pan().onUpdate((event) => {
    const newVolume =
      orientation === 'horizontal'
        ? Math.max(0, Math.min(1, event.x / width))
        : Math.max(0, Math.min(1, 1 - event.y / width));
    runOnJS(updateVolume)(newVolume);
  });

  const isHorizontal = orientation === 'horizontal';
  const containerStyle = isHorizontal ? { width, height: height + 20 } : { width: height + 20, height: width };
  const trackStyle = {
    width: isHorizontal ? width : height,
    height: isHorizontal ? height : width,
    backgroundColor: trackColor || theme.colors.secondary,
  };
  const progressStyle = {
    width: isHorizontal ? volume * width : height,
    height: isHorizontal ? height : volume * width,
    backgroundColor: progressColor || theme.colors.primary,
  };

  return (
    <View style={[styles.volumeContainer, containerStyle, style]}>
      <GestureDetector gesture={panGesture}>
        <View style={styles.volumeBar}>
          <View style={[styles.volumeTrack, trackStyle]} />
          <View style={[styles.volumeProgress, progressStyle]} />
        </View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  volumeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeBar: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeTrack: {
    borderRadius: 2,
    position: 'absolute',
  },
  volumeProgress: {
    borderRadius: 2,
    position: 'absolute',
  },
});
