import { View, Text } from 'react-native';
import { VideoPlayer } from '../components/VideoPlayer';
import { layoutStyles } from './CommonStyles';
import { defaultTheme } from '../themes/presets/defaultTheme';
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
            <View style={[layoutStyles.row]}>
              <VideoPlayer.PlayButton size={defaultTheme.iconSizes.sm} />
              <VideoPlayer.TimeDisplay style={{ marginLeft: 10 }} />
            </View>
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
