import RNVideo from 'react-native-video';
import { useEffect, useRef, type FC } from 'react';
import { StyleSheet } from 'react-native';
import type { VideoSource } from '../../types';
import { useVideo } from '../../components/providers/VideoProvider';
import { usePlayback } from '../../hooks/media/usePlayback';
import { useVolume } from '../../hooks/media/useVolume';
import { useProgress } from '../../hooks/media/useProgress';
import { useBuffering } from '../../hooks/media/useBuffering';
import { useControlsVisibility } from '../../hooks/media/useControlsVisibility';

interface VideoSurfaceProps {
  source: VideoSource;
  style?: any;
  resizeMode?: 'contain' | 'cover' | 'stretch';
  poster?: string;
}

export const VideoSurface: FC<VideoSurfaceProps> = ({ source, style, resizeMode = 'contain', poster }) => {
  const internalVideoRef = useRef(null);
  const { dispatch, state } = useVideo();
  const { isPlaying, setPlaying } = usePlayback();
  const { muted, volume } = useVolume();
  const { setCurrentTime, setDuration, seek } = useProgress();
  const { setBuffering } = useBuffering();
  const { showControls } = useControlsVisibility();
  const { playbackRate } = state;

  // Set the ref in the store once it's created
  useEffect(() => {
    if (internalVideoRef.current) {
      dispatch({ type: 'SET_VIDEO_REF', payload: internalVideoRef });
    }
  }, [dispatch]);

  useEffect(() => {
    showControls();
  }, []);

  const handleLoad = (data: any) => {
    console.log(data);
    setDuration(data.duration);
    setBuffering(false);
  };
  const handleProgress = (data: any) => setCurrentTime(data.currentTime);
  const handleBuffer = (data: any) => setBuffering(data.isBuffering);
  const handleError = (error: any) =>
    dispatch({ type: 'SET_ERROR', payload: error?.error?.errorString || 'An unknown error occurred' });
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
      onPlaybackStateChanged={(e) => console.log(e)}
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
