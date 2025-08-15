import { StyleSheet } from 'react-native';
import { useFullscreen } from '../../hooks';
import { Maximize, Minimize } from 'lucide-react-native';
import { BaseIconButton } from '../../components/common/BaseIconButton';

export interface FullscreenButtonProps {
  size?: number;
  color?: string;
  style?: any;
  renderEnterIcon?: () => React.ReactNode;
  renderExitIcon?: () => React.ReactNode;
}

export const FullscreenButton = ({ size, color, style, renderEnterIcon, renderExitIcon }: FullscreenButtonProps) => {
  const { fullscreen, toggleFullscreen } = useFullscreen();

  const EnterIcon = renderEnterIcon || Maximize;
  const ExitIcon = renderExitIcon || Minimize;

  return (
    <BaseIconButton
      IconComponent={fullscreen ? ExitIcon : EnterIcon}
      size={size}
      color={color}
      onPress={toggleFullscreen}
      style={[styles.fullscreenButton, style]}
    />
  );
};

const styles = StyleSheet.create({
  fullscreenButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
