import { StyleSheet } from 'react-native';
import { useVolume } from '../../hooks';
import { Volume2, VolumeX } from 'lucide-react-native';
import { BaseIconButton } from '../../components/common/BaseIconButton';

export interface MuteButtonProps {
  size?: number;
  color?: string;
  style?: any;
  renderMuteIcon?: () => React.ReactNode;
  renderUnmuteIcon?: () => React.ReactNode;
}

export const MuteButton = ({ size, color, style, renderMuteIcon, renderUnmuteIcon }: MuteButtonProps) => {
  const { muted, toggleMute } = useVolume();

  const MuteIcon = renderMuteIcon || VolumeX;
  const UnmuteIcon = renderUnmuteIcon || Volume2;

  return (
    <BaseIconButton
      IconComponent={muted ? MuteIcon : UnmuteIcon}
      size={size}
      color={color}
      // I dont think as no one will use extra onPress functionality here, but ill add in future if needed
      onPress={toggleMute}
      style={[styles.muteButton, style]}
    />
  );
};

const styles = StyleSheet.create({
  muteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
