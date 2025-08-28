import RNVideo, { ResizeMode, type ReactVideoProps } from 'react-native-video';
import { useEffect, useMemo, useRef, type FC } from 'react';
import { Dimensions, View, type StyleProp, type ViewStyle } from 'react-native';
import type { VideoSource } from '../../types';
import { useVideo } from '../../providers';
import { usePlayback, useVolume, useProgress, useBuffering, useControlsVisibility } from '../../hooks';

/**
 * Props for the VideoSurface component.
 */
interface VideoSurfaceProps extends ReactVideoProps {
  /**
   * The source of the video to be played.
   * This can be a remote URL or a local file path.
   */
  source: VideoSource;
  /**
   * Style for the container of the video player.
   */
  style?: ReactVideoProps['style'];
}

/**
 * A component that wraps the `react-native-video` library
 * and provides a simple interface for playing videos.
 *
 * This component is responsible for handling video playback,
 * events, and other video-related functionality.
 */
export const VideoSurface: FC<VideoSurfaceProps> = ({ source, style, ...rest }) => {
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
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      dispatch({ type: 'SET_DIMENSIONS', payload: { width: window.width, height: window.height } });
    });
    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleLoad = (data: any) => {
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
  const handleLayout = (event: any) => {
    const { layout } = event.nativeEvent;
    dispatch({ type: 'SET_VIDEO_LAYOUT', payload: layout });
  };
  const isFullscreen = state.fullscreen;
  const videoStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      width: isFullscreen ? state.dimensions.width : '100%',
      height: isFullscreen ? state.dimensions.height : undefined,
      aspectRatio: isFullscreen ? undefined : 16 / 9,
      backgroundColor: 'black',
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
    }),
    [isFullscreen, state.dimensions]
  );

  return (
    <View style={{ height: state.videoLayout.height }}>
      <RNVideo
        ref={internalVideoRef}
        source={source}
        style={[videoStyle, style]}
        resizeMode={ResizeMode.CONTAIN}
        paused={!isPlaying}
        volume={muted ? 0 : volume}
        rate={playbackRate}
        onLoad={handleLoad}
        onProgress={handleProgress}
        onBuffer={handleBuffer}
        onError={handleError}
        onEnd={handleEnd}
        progressUpdateInterval={500}
        onLayout={handleLayout}
        {...rest}
      />
    </View>
  );
};

// const styles = StyleSheet.create({
// });
