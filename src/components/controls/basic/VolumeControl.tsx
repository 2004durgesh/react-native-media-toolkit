import { View, StyleSheet } from 'react-native';
import { useVolume } from '../../../hooks/media/useVolume';
import { useVideo } from '../../../components/providers/VideoProvider';
import { useSharedValue } from 'react-native-reanimated';
import { Slider } from 'react-native-awesome-slider';

export interface VolumeControlProps {
  orientation?: 'horizontal' | 'vertical';
  width?: number;
  height?: number;
  trackColor?: string;
  progressColor?: string;
  style?: any;
}

export const VolumeControl = ({
  orientation = 'horizontal',
  width = 100,
  height = 4,
  trackColor,
  progressColor,
  style,
}: VolumeControlProps) => {
  const { volume, setVolume } = useVolume();
  const {
    state: { theme },
  } = useVideo();

  const updateVolume = (newVolume: number) => {
    setVolume(newVolume);
  };

  // Shared values for the slider
  const progress = useSharedValue(volume);
  const min = useSharedValue(0);
  const max = useSharedValue(100);
  return (
    <View style={[styles.volumeContainer, style]}>
      <Slider
        style={{ height: 40 }}
        progress={progress}
        minimumValue={min}
        maximumValue={max}
        onValueChange={updateVolume}
        theme={{
          minimumTrackTintColor: theme.colors.primary,
          maximumTrackTintColor: theme.colors.secondary,
          bubbleBackgroundColor: theme.colors.primary,
        }}
        thumbWidth={theme.sizing.md}
        containerStyle={{
          height,
          borderRadius: height / 2,
        }}
      />
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
