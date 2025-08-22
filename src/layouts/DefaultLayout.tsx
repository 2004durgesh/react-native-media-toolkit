import { View, Text } from 'react-native';
import { VideoPlayer } from '../components/VideoPlayer';
import { layoutStyles } from '../components/common/CommonStyles';
import { useBuffering } from '../hooks';

export const DefaultLayout = () => {
  const { buffering } = useBuffering();
  return (
    <VideoPlayer.Controls>
      <View style={[layoutStyles.column, { justifyContent: 'space-between', height: '100%' }]}>
        <View style={layoutStyles.topControls}>
          <Text style={{ color: 'white' }}>Dummy Text</Text>
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
