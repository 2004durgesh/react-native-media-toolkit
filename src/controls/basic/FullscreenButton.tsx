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
  onPress?: () => void;
}

export const FullscreenButton = ({
  size,
  color,
  style,
  renderEnterIcon,
  renderExitIcon,
  onPress,
}: FullscreenButtonProps) => {
  const { fullscreen, toggleFullscreen } = useFullscreen();

  const EnterIcon = renderEnterIcon || Maximize;
  const ExitIcon = renderExitIcon || Minimize;

  return (
    <BaseIconButton
      IconComponent={fullscreen ? ExitIcon : EnterIcon}
      size={size}
      color={color}
      // Using the onPress prop to allow external handling, while also toggling fullscreen, also the react-native-video has events to handle much more low-level fullscreen handling
      onPress={() => {
        (toggleFullscreen(), onPress && onPress());
      }}
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
