import React, { type ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  PlayButton,
  ProgressBar,
  TimeDisplay,
  VolumeControl,
  FullscreenButton,
  MuteButton,
  LoadingSpinner,
} from '../controls/basic';
import type { VideoPlayerConfig, VideoSource, VideoTheme } from '../types';
import { VideoOverlay } from './core/VideoOverlay';
import { VideoSurface } from './core/VideoSurface';

interface VideoPlayerProps {
  source: VideoSource;
  children?: ReactNode;
  style?: any;
  theme?: Partial<VideoTheme>;
  config?: Partial<VideoPlayerConfig>;
  resizeMode?: 'contain' | 'cover' | 'stretch';
  poster?: string;
}

const VideoPlayerComponent = ({ source, children, style, resizeMode, poster }: VideoPlayerProps) => {
  // this is the root of all the project :)
  return (
    <View style={[styles.container, style]}>
      <VideoOverlay style={styles.videoContainer} overlay={false}>
        <VideoSurface source={source} resizeMode={resizeMode} poster={poster} />
        {children}
      </VideoOverlay>
    </View>
  );
};

// VideoControls component that wraps VideoOverlay for controls
const VideoControls: React.FC<{ children?: ReactNode; style?: any }> = ({ children, style }) => {
  return (
    <VideoOverlay style={style} overlay={true}>
      {children}
    </VideoOverlay>
  );
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
    backgroundColor: '#000000',
  },
  videoContainer: {
    flex: 1,
  },
});
