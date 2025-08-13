import { View, StyleSheet, Platform, Text } from 'react-native';
import { VideoPlayer, DefaultSkin, Test } from '../../src';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const videoSource = {
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  };

  console.log('App is rendering, Platform:', Platform.OS);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.videoContainer}>
          <Test />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    marginVertical: 20,
    borderWidth: 2,
    borderColor: '#00ff00',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ff0000',
    flex: 1,
  },
});
