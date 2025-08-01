import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useVideo } from '@/store/videoStore';
import type { FC } from 'react';

export interface PlayButtonProps {
  size?: number;
  color?: string;
  style?: any;
  renderPlayIcon?: () => React.ReactNode;
  renderPauseIcon?: () => React.ReactNode;
}

export const PlayButton: FC<PlayButtonProps> = ({ size = 50, color, style, renderPlayIcon, renderPauseIcon }) => {
  // Use separate selectors to avoid creating new objects
  const isPlaying = useVideo((state) => state.isPlaying);
  const theme = useVideo((state) => state.theme);
  const togglePlayPause = useVideo((state) => state.togglePlayPause);

  const iconColor = color || theme.colors.text;

  const PlayIcon = () =>
    renderPlayIcon ? renderPlayIcon() : <View style={[styles.triangle, { borderLeftColor: iconColor }]} />;
  const PauseIcon = () =>
    renderPauseIcon ? (
      renderPauseIcon()
    ) : (
      <View style={styles.pauseContainer}>
        <View style={[styles.pauseBar, { backgroundColor: iconColor }]} />
        <View style={[styles.pauseBar, { backgroundColor: iconColor }]} />
      </View>
    );

  return (
    <TouchableOpacity
      onPress={togglePlayPause}
      style={[styles.playButton, { width: size, height: size }, style]}
      activeOpacity={0.8}>
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  playButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  triangle: {
    width: 0,
    height: 0,
    borderTopWidth: 15,
    borderBottomWidth: 15,
    borderLeftWidth: 20,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 3, // Slight offset to center the triangle
  },
  pauseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  pauseBar: {
    width: 4,
    height: 18,
    borderRadius: 1,
  },
});
