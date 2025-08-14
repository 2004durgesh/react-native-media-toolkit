import { View, Text } from 'react-native'
import { VideoPlayer } from '../components/VideoPlayer'
import { skinStyles } from './CommomStyles'

export const DefaultSkin = () => {
  return (
    <VideoPlayer.Controls>
        <View style={skinStyles.centerControls}>
          <VideoPlayer.PlayButton size={60} />
        </View>
        <View style={skinStyles.bottomControls}>
          <VideoPlayer.ProgressBar />
          <View style={skinStyles.bottomRow}>
            <VideoPlayer.PlayButton size={30} />
            <VideoPlayer.TimeDisplay />
            <View style={skinStyles.spacer} />
            <VideoPlayer.VolumeControl width={80} />
          </View>
        </View>
      </VideoPlayer.Controls>
  )
}
