import { View } from 'react-native';
import { VideoPlayer } from '../components/VideoPlayer';
import { layoutStyles } from './CommonStyles';

export const DefaultLayout = () => {
  return (
    <VideoPlayer.Controls>
      <View style={layoutStyles.centerControls}>
        <VideoPlayer.PlayButton size={60} />
      </View>
      <View style={layoutStyles.bottomControls}>
        <VideoPlayer.ProgressBar />
        <View style={layoutStyles.bottomRow}>
          <VideoPlayer.PlayButton size={30} />
          <VideoPlayer.TimeDisplay />
          <View style={layoutStyles.spacer} />
          <VideoPlayer.VolumeControl width={80} />
        </View>
      </View>
    </VideoPlayer.Controls>
  );
};
