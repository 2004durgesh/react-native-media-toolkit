import { StyleSheet } from 'react-native';
import type { FC, ReactNode } from 'react';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useEffect } from 'react';
import TapHandler from '../gestures/TapHandler';
import { useVideo } from '../../components/providers/VideoProvider';
import { useControlsVisibility } from '../../hooks/media/useControlsVisibility';

interface VideoOverlayProps {
  children?: ReactNode;
  style?: any;
  overlay?: boolean;
}

export const VideoOverlay: FC<VideoOverlayProps> = ({ children, style, overlay = true }) => {
  // Create shared value for opacity - only for controls, not video container
  const opacity = useSharedValue(1);

  // Get theme and store functions
  const {
    state: { theme },
  } = useVideo();
  const { setOpacity } = useControlsVisibility();

  // Only set the opacity shared value in the store if this is a controls overlay
  useEffect(() => {
    if (overlay) {
      setOpacity(opacity);
    }
  }, [opacity, setOpacity, overlay]);

  const baseStyle = overlay ? styles.overlayControls : styles.controls;

  const animatedStyle = useAnimatedStyle(
    () => ({
      backgroundColor: overlay ? theme.colors.overlay : 'transparent',
      opacity: overlay ? opacity.value : 1, // Only animate opacity for controls
    }),
    [overlay, theme.colors.overlay]
  );

  return (
    <Animated.View style={[baseStyle, animatedStyle, style]} pointerEvents="box-none">
      {/* <DoubleTapGesture> */}
      <TapHandler>{children}</TapHandler>
      {/* </DoubleTapGesture> */}
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
