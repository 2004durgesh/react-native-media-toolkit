import RNVideo, { ResizeMode, type ReactVideoProps } from 'react-native-video';
import { useEffect, useMemo, useRef, useState, type FC } from 'react';
import { Dimensions, View, type StyleProp, type ViewStyle } from 'react-native';
import type { VideoSource } from '../../types';
import { useVideo } from '../../providers';
import { usePlayback, useVolume, useProgress, useBuffering, useControlsVisibility } from '../../hooks';

interface VideoSurfaceProps extends ReactVideoProps {
  source: VideoSource;
  style?: ReactVideoProps['style'];
  props?: ReactVideoProps;
}

export const VideoSurface: FC<VideoSurfaceProps> = ({ source, style, props }) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  });

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
      width: isFullscreen ? dimensions.width : '100%',
      height: isFullscreen ? dimensions.height : undefined,
      aspectRatio: isFullscreen ? undefined : 16 / 9,
      backgroundColor: 'black',
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
    }),
    [isFullscreen, dimensions]
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
        {...props}
        onLayout={handleLayout}
      />
    </View>
  );
};

// const styles = StyleSheet.create({
// });
