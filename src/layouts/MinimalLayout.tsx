import { View, StyleSheet } from 'react-native';
import { VideoPlayer } from '../components/VideoPlayer';
import { layoutStyles } from '../components/common/CommonStyles';
import { useBuffering, useControlsVisibility } from '../hooks';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useVideo } from 'src/providers';
import { useEffect } from 'react';
import { Title } from 'src/components/info/Title';
import { Subtitle } from 'src/components/info/Subtitle';

export const MinimalLayout = () => {
  const { buffering } = useBuffering();
  const opacity = useSharedValue(1);

  // Get theme and store functions
  const {
    state: { theme },
    state,
  } = useVideo();
  const { setOpacity } = useControlsVisibility();

  useEffect(() => {
    setOpacity(opacity);
  }, [opacity, setOpacity]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      backgroundColor: theme.colors.overlay,
      opacity: opacity.value,
    }),
    [theme.colors.overlay]
  );
  return (
    <Animated.View style={[styles.baseStyle, animatedStyle]} pointerEvents="box-none">
      <VideoPlayer.Controls>
        <View
          style={[
            layoutStyles.column,
            { justifyContent: 'space-between', height: '100%', paddingHorizontal: state.fullscreen ? 25 : 15 },
          ]}>
          <View style={layoutStyles.topControls}>
            <Title text="Video Title" />
            <Subtitle text="Video Subtitle" />
          </View>
          <View style={layoutStyles.centerControls}>
            {!buffering ? <VideoPlayer.PlayButton /> : <VideoPlayer.LoadingSpinner />}
          </View>
          <View style={[layoutStyles.bottomControls]}>
            <VideoPlayer.ProgressBar />
            <View style={layoutStyles.row}>
              <VideoPlayer.TimeDisplay />
              <View style={layoutStyles.spacer} />
              <View style={[layoutStyles.row]}>
                <VideoPlayer.FullscreenButton />
                <VideoPlayer.MuteButton style={{ marginLeft: 10 }} />
              </View>
            </View>
          </View>
        </View>
      </VideoPlayer.Controls>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  baseStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
