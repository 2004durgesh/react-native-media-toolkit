import { View } from 'react-native';
import { VideoPlayer } from '../components/VideoPlayer';
import { skinStyles } from './CommomStyles';

export const MinimalSkin = () => {
  return (
    <VideoPlayer.Controls>
      <View style={skinStyles.centerControls}>
        <VideoPlayer.PlayButton size={50} />
      </View>
      <View style={skinStyles.bottomMinimal}>
        <VideoPlayer.ProgressBar height={2} />
      </View>
    </VideoPlayer.Controls>
  );
};

