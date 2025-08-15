import { View, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { Slider } from 'react-native-awesome-slider';
import { useProgress, useControlsVisibility } from '../../hooks';
import { useVideo } from '../../providers';

export interface ProgressBarProps {
  height?: number;
  trackColor?: string;
  progressColor?: string;
  thumbWidth?: number;
  style?: StyleProp<ViewStyle>;
}

export const ProgressBar = ({ height = 4, trackColor, progressColor, thumbWidth = 12, style }: ProgressBarProps) => {
  const { currentTime, duration, seek } = useProgress();
  const { showControls } = useControlsVisibility();
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

  const handleSlidingStart = () => {
    showControls();
  };

  const handleValueChange = (val: number) => {
    seek(Math.round(val));
  };

  return (
    <View style={[styles.container, style]}>
      <Slider
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
        thumbWidth={thumbWidth}
        containerStyle={{
          height,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});
