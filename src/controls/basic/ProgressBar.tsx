import { View, StyleSheet, type ViewStyle } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { Slider } from 'react-native-awesome-slider';
import { useProgress, useControlsVisibility, useBuffering } from '../../hooks';
import { useVideo } from '../../providers';

export interface ProgressBarProps {
  height?: number;
  trackColor?: string;
  progressColor?: string;
  thumbColor?: string;
  thumbSize?: number;
  style?: ViewStyle;
}

export const ProgressBar = ({
  height = 4,
  trackColor,
  progressColor,
  thumbSize = 12,
  thumbColor,
  style,
}: ProgressBarProps) => {
  const { currentTime, duration, seek } = useProgress();
  const { showControls } = useControlsVisibility();
  const { buffering } = useBuffering();
  const {
    state: { theme },
  } = useVideo();

  // Shared values for the slider
  const progress = useSharedValue(currentTime);
  const min = useSharedValue(0);
  const max = useSharedValue(duration);

  // Update slider when state changes
  progress.value = currentTime;
  max.value = duration;

  const trackBg = trackColor ?? theme.colors.secondary;
  const progressBg = progressColor ?? theme.colors.primary;
  const thumbBg = thumbColor ?? theme.colors.primary;

  const handleSlidingStart = () => {
    showControls();
  };

  const handleValueChange = (val: number) => {
    seek(Math.round(val));
  };

  return (
    <View style={[styles.container, style]}>
      <Slider
        style={{ height: 40 }}
        progress={progress}
        minimumValue={min}
        maximumValue={max}
        onSlidingStart={handleSlidingStart}
        onValueChange={handleValueChange}
        theme={{
          minimumTrackTintColor: progressBg,
          maximumTrackTintColor: trackBg,
          bubbleBackgroundColor: progressBg,
        }}
        thumbWidth={thumbSize}
        containerStyle={{
          height,
          borderRadius: height / 2,
        }}
      />
      {buffering && <View style={[styles.bufferingIndicator, { backgroundColor: theme.colors.accent }]} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 12,
    justifyContent: 'center',
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
