import { Image } from 'expo-image';
import { Platform, StyleSheet, View ,Text} from 'react-native';
import {VideoPlayer,MinimalSkin} from "../../../src"

export default function HomeScreen() {
  const videoSource = {
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  };
  return (
   <>
   <View style={styles.titleContainer}>
        <Text>Welcome!</Text>
      </View>
      <View style={styles.videoContainer}>
          <VideoPlayer source={videoSource} style={styles.videoPlayer}>
            <MinimalSkin />
          </VideoPlayer>
        </View>
   </>
      
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
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
