import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import { DefaultSkin, MinimalSkin, Test, VideoPlayer } from '../../../src';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
export default function App() {
  const videoSource = {
    uri: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>React Native Media Toolkit Example</Text>
          <View style={styles.videoContainer}>
            <VideoPlayer source={videoSource} style={styles.videoPlayer}>
              <DefaultSkin />
            </VideoPlayer>
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  videoContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
  },
  videoPlayer: {
    flex: 1,
  },
});
