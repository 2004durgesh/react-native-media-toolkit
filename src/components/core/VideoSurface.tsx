import RNVideo from 'react-native-video';
import { useEffect, useRef, type FC } from 'react';
import { StyleSheet } from 'react-native';
import type { VideoSource } from '@/types/video';
import { useVideo } from '@/store/videoStore';

interface VideoSurfaceProps {
  source: VideoSource;
  style?: any;
  resizeMode?: 'contain' | 'cover' | 'stretch';
  poster?: string;
}

export const VideoSurface: FC<VideoSurfaceProps> = ({ source, style, resizeMode = 'contain', poster }) => {
  const internalVideoRef = useRef(null);

  // Use separate selectors to avoid creating new objects
  const isPlaying = useVideo((state) => state.isPlaying);
  const muted = useVideo((state) => state.muted);
  const volume = useVideo((state) => state.volume);
  const playbackRate = useVideo((state) => state.playbackRate);
  const setPlaying = useVideo((state) => state.setPlaying);
  const setCurrentTime = useVideo((state) => state.setCurrentTime);
  const setDuration = useVideo((state) => state.setDuration);
  const setBuffering = useVideo((state) => state.setBuffering);
  const setError = useVideo((state) => state.setError);
  const showControls = useVideo((state) => state.showControls);
  const setVideoRef = useVideo((state) => state.setVideoRef);
  const seek = useVideo((state) => state.seek);

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
