import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useFullscreen } from '../../hooks';
import { useVideo } from '../../providers';

export interface FullscreenButtonProps {
  size?: number;
  color?: string;
  style?: any;
  renderEnterIcon?: () => React.ReactNode;
  renderExitIcon?: () => React.ReactNode;
}

export const FullscreenButton = ({
  size = 30,
  color,
  style,
  renderEnterIcon,
  renderExitIcon,
}: FullscreenButtonProps) => {
  const { fullscreen, toggleFullscreen } = useFullscreen();
  const {
    state: { theme },
  } = useVideo();

  const iconColor = color || theme.colors.text;

  const EnterIcon = () =>
    renderEnterIcon ? (
      renderEnterIcon()
    ) : (
      <View style={[styles.icon, { borderColor: iconColor, width: size, height: size }]}>
        <View style={[styles.corner, styles.topLeft, { borderLeftColor: iconColor, borderTopColor: iconColor }]} />
        <View style={[styles.corner, styles.topRight, { borderRightColor: iconColor, borderTopColor: iconColor }]} />
        <View
          style={[styles.corner, styles.bottomLeft, { borderLeftColor: iconColor, borderBottomColor: iconColor }]}
        />
        <View
          style={[styles.corner, styles.bottomRight, { borderRightColor: iconColor, borderBottomColor: iconColor }]}
        />
      </View>
    );
  const ExitIcon = () =>
    renderExitIcon ? (
      renderExitIcon()
    ) : (
      <View style={[styles.icon, { borderColor: iconColor, width: size, height: size }]}>
        <View style={[styles.corner, styles.topLeft, { borderLeftColor: iconColor, borderTopColor: iconColor }]} />
        <View style={[styles.corner, styles.topRight, { borderRightColor: iconColor, borderTopColor: iconColor }]} />
        <View
          style={[styles.corner, styles.bottomLeft, { borderLeftColor: iconColor, borderBottomColor: iconColor }]}
        />
        <View
          style={[styles.corner, styles.bottomRight, { borderRightColor: iconColor, borderBottomColor: iconColor }]}
        />
      </View>
    );

  return (
    <TouchableOpacity
      onPress={toggleFullscreen}
      style={[styles.fullscreenButton, { width: size, height: size }, style]}
      activeOpacity={0.8}>
      {fullscreen ? <ExitIcon /> : <EnterIcon />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fullscreenButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  icon: {
    borderWidth: 2,
    borderRadius: 5,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: '40%',
    height: '40%',
    borderWidth: 2,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
});
