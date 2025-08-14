import { View } from 'react-native';
import { VideoPlayer } from '../components/VideoPlayer';
import { layoutStyles } from './CommonStyles';

export const MinimalLayout = () => {
  return (
    <VideoPlayer.Controls>
      <View style={layoutStyles.centerControls}>
        <VideoPlayer.PlayButton size={50} />
      </View>
      <View style={layoutStyles.bottomMinimal}>
        <VideoPlayer.ProgressBar height={2} />
      </View>
    </VideoPlayer.Controls>
  );
};
