import React, { type ReactNode, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { PlayButton } from './controls/basic/PlayButton';
import { ProgressBar } from './controls/basic/ProgressBar';
import { TimeDisplay } from './controls/basic/TimeDisplay';
import { VolumeControl } from './controls/basic/VolumeControl';
import type { VideoPlayerConfig, VideoSource, VideoTheme } from '@/types/video';
import { useVideoStore } from '@/store/videoStore';
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

const VideoPlayerComponent = ({ source, children, style, resizeMode, poster, theme, config }: VideoPlayerProps) => {
  // Get the initializer from the store
  const initialize = useVideoStore((state) => state.initialize);

  // Initialize store with props on mount and when props change
  useEffect(() => {
    initialize({ theme, config });
  }, [theme, config, initialize]);

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
});

// Pre-built skins (no changes needed)
export const DefaultSkin = () => (
  <VideoPlayer.Controls>
    <View style={skinStyles.centerControls}>
      <VideoPlayer.PlayButton size={60} />
    </View>
    <View style={skinStyles.bottomControls}>
      <VideoPlayer.ProgressBar />
      <View style={skinStyles.bottomRow}>
        <VideoPlayer.PlayButton size={30} />
        <VideoPlayer.TimeDisplay />
        <View style={skinStyles.spacer} />
        <VideoPlayer.VolumeControl width={80} />
      </View>
    </View>
  </VideoPlayer.Controls>
);

export const MinimalSkin = () => (
  <VideoPlayer.Controls>
    <View style={skinStyles.centerControls}>
      <VideoPlayer.PlayButton size={50} />
    </View>
    <View style={skinStyles.bottomMinimal}>
      <VideoPlayer.ProgressBar height={2} />
    </View>
  </VideoPlayer.Controls>
);

const skinStyles = StyleSheet.create({
  centerControls: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bottomControls: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  spacer: { flex: 1 },
  bottomMinimal: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingBottom: 8 },
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
