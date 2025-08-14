import React from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  SafeAreaView,
} from 'react-native';
// @ts-ignore
import { VideoPlayer, MinimalSkin } from '../../../src';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const videoSource = {
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.content}>
        <Text style={styles.title}>React Native Media Toolkit Example</Text>
        <View style={styles.videoContainer}>
          <VideoPlayer source={videoSource} style={styles.videoPlayer}>
            <MinimalSkin />
          </VideoPlayer>
        </View>
      </View>
    </SafeAreaView>
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

export default App;
