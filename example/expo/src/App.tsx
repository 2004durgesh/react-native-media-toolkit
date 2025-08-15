import React, { useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { DefaultLayout, MinimalLayout, VideoPlayer, VideoProvider } from '../../../src';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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

export default function App() {
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
  ];

  const [uri, setUri] = useState<string>(samples[1]?.uri!);

  const videoSource = { uri };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>React Native Media Toolkit Example</Text>

          <View style={styles.videoContainer}>
            <VideoProvider>
              <VideoPlayer source={videoSource} containerStyle={styles.videoPlayer}>
                <MinimalLayout />
              </VideoPlayer>
            </VideoProvider>
          </View>

          <SampleSelector samples={samples} currentUri={uri} onSelect={setUri} />
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
