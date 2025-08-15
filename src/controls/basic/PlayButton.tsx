import { StyleSheet } from 'react-native';
import { usePlayback } from '../../hooks';
import { Pause, Play } from 'lucide-react-native';
import { BaseIconButton } from '../../components/common/BaseIconButton';

export interface PlayButtonProps {
  size?: number;
  color?: string;
  style?: any;
  renderPlayIcon?: () => React.ReactNode;
  renderPauseIcon?: () => React.ReactNode;
  onPress?: () => void;
}

export const PlayButton = ({ size, color, style, renderPlayIcon, renderPauseIcon, onPress }: PlayButtonProps) => {
  const { isPlaying, togglePlayPause } = usePlayback();

  const PlayIcon = renderPlayIcon || Play;
  const PauseIcon = renderPauseIcon || Pause;

  return (
    <BaseIconButton
      IconComponent={isPlaying ? PauseIcon : PlayIcon}
      size={size}
      color={color}
      // Using the onPress prop to allow external handling, while also toggling play/pause
      onPress={() => {
        (togglePlayPause(), onPress && onPress());
      }}
      style={[styles.playButton, style]}
    />
  );
};

const styles = StyleSheet.create({
  playButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
