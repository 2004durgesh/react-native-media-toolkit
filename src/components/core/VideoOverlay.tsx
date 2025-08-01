import { StyleSheet } from 'react-native';
import { useVideo } from '@/store/videoStore';
import type { FC, ReactNode } from 'react';
import Animated from 'react-native-reanimated';
import { useMemo } from 'react';

interface VideoOverlayProps {
  children?: ReactNode;
  style?: any;
  overlay?: boolean;
}

export const VideoOverlay: FC<VideoOverlayProps> = ({ children, style, overlay = true }) => {
  // Use separate selectors to avoid creating new objects
  const controlsOpacity = useVideo((state) => state.controlsOpacity);
  const theme = useVideo((state) => state.theme);

  const baseStyle = overlay ? styles.overlayControls : styles.controls;
  const animatedStyle = useMemo(
    () => ({
      backgroundColor: overlay ? theme.colors.overlay : 'transparent',
      opacity: controlsOpacity,
    }),
    [overlay, theme.colors.overlay, controlsOpacity]
  );

  return (
    <Animated.View style={[baseStyle, animatedStyle, style]} pointerEvents="box-none">
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  controls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overlayControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
