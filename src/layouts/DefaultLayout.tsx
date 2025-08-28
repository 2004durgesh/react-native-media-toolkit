import { View } from 'react-native';
import { VideoPlayer } from '../components/VideoPlayer';
import { CommonLayoutStyles as layoutStyles } from '../components/common/CommonLayoutStyles';
import { useBuffering } from '../hooks';
import { Title, Subtitle } from '../display';
import { defaultTheme } from '../themes';
import { useEffect } from 'react';
import { useVideo } from '../providers';

export const DefaultLayout = () => {
  const { buffering } = useBuffering();
  const { setTheme } = useVideo();

  useEffect(() => {
    setTheme(defaultTheme);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VideoPlayer.Controls>
      <View style={[layoutStyles.column, { justifyContent: 'space-between', height: '100%' }]}>
        <View style={layoutStyles.topControls}>
          <Title text="Default Title" />
          <Subtitle text="Deafult Subtitle" />
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
  );
};
