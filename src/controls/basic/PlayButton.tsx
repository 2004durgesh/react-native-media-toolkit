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
}

export const PlayButton = ({ size, color, style, renderPlayIcon, renderPauseIcon }: PlayButtonProps) => {
  const { isPlaying, togglePlayPause } = usePlayback();

  const PlayIcon = renderPlayIcon || Play;
  const PauseIcon = renderPauseIcon || Pause;

  return (
    <BaseIconButton
      IconComponent={isPlaying ? PauseIcon : PlayIcon}
      size={size}
      color={color}
      onPress={togglePlayPause}
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
