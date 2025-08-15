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
import type { VideoSource } from '../types';
import { VideoSurface } from './core';
import type { ReactVideoProps } from 'react-native-video';
import { TapHandler } from 'src/gestures';

interface VideoPlayerProps {
  source: VideoSource;
  children?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  videoProps?: ReactVideoProps;
}

const VideoPlayerComponent = ({ source, children, containerStyle, videoProps }: VideoPlayerProps) => {
  // this is the root of all the things :)
  return (
    <View style={[styles.container, containerStyle]}>
      <TapHandler>
        <View style={styles.videoContainer}>
          <VideoSurface {...videoProps} source={source} />
          {children}
        </View>
      </TapHandler>
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
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: 'green',
  },
  videoContainer: {
    flex: 1,
  },
  controlsContainer: {
    ...StyleSheet.absoluteFillObject,
  },
});
