import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useVolume } from '../../hooks';
import { useVideo } from '../../providers';
import { useSharedValue } from 'react-native-reanimated';
import { Slider } from 'react-native-awesome-slider';

export interface VolumeControlProps {
  orientation?: 'horizontal' | 'vertical';
  width?: number;
  height?: number;
  thumbWidth?: number;
  trackColor?: string;
  progressColor?: string;
  style?: StyleProp<ViewStyle>;
}

export const VolumeControl = ({
  orientation = 'horizontal',
  width = 100,
  height = 4,
  thumbWidth = 12,
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
    <View style={style}>
      <Slider
        progress={progress}
        minimumValue={min}
        maximumValue={max}
        onValueChange={updateVolume}
        theme={{
          minimumTrackTintColor: theme.colors.primary,
          maximumTrackTintColor: theme.colors.secondary,
        }}
        renderBubble={() => null}
        thumbWidth={thumbWidth}
        containerStyle={{
          height,
          width,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
};
