import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Button } from 'react-native';
import { DefaultLayout, MinimalLayout, VideoPlayer, VideoProvider, useFullscreen } from '../../../src';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
type Sample = {
  type: string;
  uri: string; // string for remote, number for require()
};

interface SampleSelectorProps {
  samples: Sample[];
  currentUri: string;
  onSelect: (uri: string) => void;
}

const SampleSelector: React.FC<SampleSelectorProps> = ({ samples, currentUri, onSelect }) => (
  <View style={styles.sampleSelector}>
    <Text style={styles.sampleSelectorTitle}>Choose a Sample</Text>
    {samples.map((sample, index) => {
      const isActive = sample.uri === currentUri;
      return (
        <TouchableOpacity
          key={index}
          style={[
            styles.sample,
            isActive && styles.activeSample, // highlight if playing
          ]}
          onPress={() => onSelect(sample.uri)}>
          <Text style={styles.sampleText}>{sample.type}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const Main = () => {
  const samples: Sample[] = [
    {
      type: 'mp4',
      uri: 'https://live-hls-abr-cdn.livepush.io/vod/bigbuckbunnyclip.mp4',
    },
    {
      type: 'hls',
      uri: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    },
    {
      type: 'dash',
      uri: 'https://dash.akamaized.net/dash264/TestCasesUHD/2b/11/MultiRate.mpd',
    },
    { type: 'asset', uri: require('../assets/test.mp4') },
    { type: 'asset-vertical', uri: require('../assets/vertical.mp4') },
  ];
  const { fullscreen } = useFullscreen();
  const [uri, setUri] = useState<string>(samples[1]?.uri!);
  const videoSource = { uri };

  return (
    <>
      <VideoPlayer source={videoSource} containerStyle={styles.videoPlayer}>
        <MinimalLayout />
      </VideoPlayer>
      {/* <Button title="pres me" onPress={()=>{SystemBars}}/> */}
      {!fullscreen && <SampleSelector samples={samples} currentUri={uri} onSelect={setUri} />}
    </>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'black' }}>
      <VideoProvider
        config={{
          enableScreenRotation: true,
          onEnterFullscreen: () => console.log('Entered fullscreen'),
          onExitFullscreen: () => console.log('Exited fullscreen'),
          onHideControls: () => console.log('Controls hidden'),
          onShowControls: () => console.log('Controls shown'),
        }}>
        <Main />
      </VideoProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
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
    // flex: 1,
    backgroundColor: 'red',
  },
  sampleSelector: {
    marginTop: 20,
    width: '100%',
  },
  sampleSelectorTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sample: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeSample: {
    borderColor: '#4da6ff',
  },
  sampleText: {
    color: '#fff',
    fontSize: 14,
  },
});
