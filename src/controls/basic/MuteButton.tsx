import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useVolume } from '../../hooks';
import { useVideo } from '../../providers';

export interface MuteButtonProps {
  size?: number;
  color?: string;
  style?: any;
  renderMuteIcon?: () => React.ReactNode;
  renderUnmuteIcon?: () => React.ReactNode;
}

export const MuteButton = ({ size = 30, color, style, renderMuteIcon, renderUnmuteIcon }: MuteButtonProps) => {
  const { muted, toggleMute } = useVolume();
  const {
    state: { theme },
  } = useVideo();

  const iconColor = color || theme.colors.text;

  const MuteIcon = () =>
    renderMuteIcon ? (
      renderMuteIcon()
    ) : (
      <View style={[styles.icon, { borderColor: iconColor, width: size, height: size }]}>
        <View style={[styles.line, { backgroundColor: iconColor }]} />
      </View>
    );
  const UnmuteIcon = () =>
    renderUnmuteIcon ? (
      renderUnmuteIcon()
    ) : (
      <View style={[styles.icon, { borderColor: iconColor, width: size, height: size }]} />
    );

  return (
    <TouchableOpacity
      onPress={toggleMute}
      style={[styles.muteButton, { width: size, height: size }, style]}
      activeOpacity={0.8}>
      {muted ? <MuteIcon /> : <UnmuteIcon />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  muteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  icon: {
    borderWidth: 2,
    borderRadius: 5,
  },
  line: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '120%',
    height: 2,
    transform: [{ translateX: -15 }, { translateY: -1 }, { rotate: '45deg' }],
  },
});
