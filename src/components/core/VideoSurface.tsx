import RNVideo from 'react-native-video';
import { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import type { VideoSource } from '../../types';
import { useVideo, useVideoActions } from '../../store';

interface VideoSurfaceProps {
  source: VideoSource;
  style?: any;
  resizeMode?: 'contain' | 'cover' | 'stretch';
  poster?: string;
}

export const VideoSurface = ({ source, style, resizeMode = 'contain', poster }: VideoSurfaceProps) => {
  const internalVideoRef = useRef(null);

  // Use separate selectors to avoid creating new objects
  const isPlaying = useVideo((state) => state.isPlaying);
  const muted = useVideo((state) => state.muted);
  const volume = useVideo((state) => state.volume);
  const playbackRate = useVideo((state) => state.playbackRate);

  // Get actions from context
  const { setPlaying, setCurrentTime, setDuration, setBuffering, setError, showControls, setVideoRef, seek } =
    useVideoActions();

  // Set the ref in the store once it's created
  useEffect(() => {
    if (internalVideoRef.current) {
      setVideoRef(internalVideoRef);
    }
  }, [setVideoRef]);

  useEffect(() => {
    showControls();
  }, [showControls]);

  const handleLoad = (data: any) => {
    setDuration(data.duration);
    setBuffering(false);
  };
  const handleProgress = (data: any) => setCurrentTime(data.currentTime);
  const handleBuffer = (data: any) => setBuffering(data.isBuffering);
  const handleError = (error: any) => setError(error?.error?.errorString || 'An unknown error occurred');
  const handleEnd = () => {
    setPlaying(false);
    seek(0);
    showControls();
  };

  return (
    <RNVideo
      ref={internalVideoRef}
      source={source}
      style={[styles.video, style]}
      resizeMode={resizeMode}
      poster={poster}
      paused={!isPlaying}
      volume={muted ? 0 : volume}
      rate={playbackRate}
      onLoad={handleLoad}
      onProgress={handleProgress}
      onBuffer={handleBuffer}
      onError={handleError}
      onEnd={handleEnd}
      progressUpdateInterval={500}
    />
  );
};

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: '100%',
  },
});
