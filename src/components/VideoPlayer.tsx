import React, { type ReactNode } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import {
  PlayButton,
  ProgressBar,
  TimeDisplay,
  VolumeControl,
  FullscreenButton,
  MuteButton,
  LoadingSpinner,
} from '../controls/basic';
import type { GestureHandlerProps, VideoSource } from '../types';
import { VideoSurface } from './core';
import type { ReactVideoProps } from 'react-native-video';
import { GestureHandler } from '../gestures';
import { useVideo } from '../providers';

interface VideoPlayerProps {
  source: VideoSource;
  children?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  videoProps?: ReactVideoProps;
  gestureProps?: GestureHandlerProps;
}

const VideoPlayerComponent = ({ source, children, containerStyle, videoProps, gestureProps }: VideoPlayerProps) => {
  // this is the root of all the things :)
  const { state } = useVideo();
  return (
    <View
      style={[
        { position: 'relative', height: state.fullscreen ? state.videoLayout.width : state.videoLayout.height },
        containerStyle,
      ]}>
      <GestureHandler {...gestureProps}>
        <View style={{ overflow: 'hidden' }}>
          <VideoSurface {...videoProps} source={source} />
          {children}
        </View>
      </GestureHandler>
    </View>
  );
};

// VideoControls component that wraps VideoOverlay for controls
const VideoControls: React.FC<{ children?: ReactNode; style?: any }> = ({ children, style }) => {
  return <View style={[styles.controlsContainer, style]}>{children}</View>;
};

// Compound component pattern remains the same
export const VideoPlayer = Object.assign(VideoPlayerComponent, {
  Controls: VideoControls,
  PlayButton,
  ProgressBar,
  TimeDisplay,
  VolumeControl,
  FullscreenButton,
  MuteButton,
  LoadingSpinner,
});

const styles = StyleSheet.create({
  controlsContainer: {
    ...StyleSheet.absoluteFillObject,
  },
});
