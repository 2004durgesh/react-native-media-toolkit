import React from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  SafeAreaView,
} from 'react-native';
import {
  VideoPlayer,
  MinimalLayout,
  VideoProvider,
  DefaultLayout,
  minimalTheme,
} from '../../src/index';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const videoSource = {
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <VideoProvider
        theme={minimalTheme}
        config={{ enableScreenRotation: true }}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <VideoPlayer source={videoSource} containerStyle={styles.videoPlayer}>
            <MinimalLayout />
          </VideoPlayer>
        </SafeAreaView>
      </VideoProvider>
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

export default App;
