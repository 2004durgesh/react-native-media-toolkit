---
sidebar_position: 2
---

# Customization

`react-native-media-toolkit` is designed for high customizability, allowing you to create unique video player experiences. This section covers how to leverage its compound component pattern, theming system, and gesture controls.

## Compound Components

The `VideoPlayer` component uses a compound component pattern, meaning it exposes several sub-components that you can arrange and style as needed. This gives you full control over the player's UI layout.

Here's an example of building a custom player UI:

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  VideoPlayer,
  PlayButton,
  ProgressBar,
  TimeDisplay,
  FullscreenButton,
  MuteButton,
  VolumeControl,
  LoadingSpinner,
} from 'react-native-media-toolkit';

const CustomPlayerUI = () => {
  return (
    <VideoPlayer.Controls style={styles.controlsContainer}>
      {/* Top controls */}
      <View style={styles.topControls}>
        <MuteButton />
        <VolumeControl />
        <View style={{ flex: 1 }} /> {/* Spacer */}
        <FullscreenButton />
      </View>

      {/* Middle controls (e.g., loading spinner) */}
      <View style={styles.middleControls}>
        <LoadingSpinner />
      </View>

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        <PlayButton />
        <TimeDisplay />
        <ProgressBar />
      </View>
    </VideoPlayer.Controls>
  );
};

const CustomPlayerExample = () => {
  const videoSource = {
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  };

  return (
    <VideoPlayer source={videoSource}>
      <CustomPlayerUI />
    </VideoPlayer>
  );
};

const styles = StyleSheet.create({
  controlsContainer: {
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  middleControls: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
});

export default CustomPlayerExample;
```

## Theming

The library provides a flexible theming system to easily customize colors, fonts, sizing, and other visual elements.
Custom themes should be of type [`Theme`](../../src/types/theme.ts)

```tsx
import React from 'react';
import { VideoPlayer, ThemeProvider } from 'react-native-media-toolkit';

const customTheme = {
  colors: {
    primary: '#ff6347', // Tomato red
    secondary: '#4682b4', // Steel blue
    accent: '#ffeb3b', // Bright yellow
    background: 'rgba(0, 0, 0, 0.6)',
    text: '#ffffff',
  },
  // ... other theme properties (sizing, fonts, etc.)
};

const ThemedPlayer = () => {
  const videoSource = {
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  };

  return (
    <VideoProvider theme={customTheme}>
      <VideoPlayer source={videoSource}>{/* Your custom UI or a built-in layout */}</VideoPlayer>
    </VideoProvider>
  );
};

export default ThemedPlayer;
```

## Configuration Options

The `VideoPlayer` component accepts various props to configure its behavior. Here are some commonly used options:

```tsx
<VideoProvider
  theme={{ ...customTheme }}
  config={{
    enableScreenRotation: true,
    onEnterFullscreen: () => console.log('Entered fullscreen'),
    onExitFullscreen: () => console.log('Exited fullscreen'),
    onHideControls: () => console.log('Controls hidden'),
    onShowControls: () => console.log('Controls shown'),
  }}>
  <VideoPlayer source={videoSource}>
    <CustomPlayerUI />
  </VideoPlayer>
</VideoProvider>
```

## Gestures

The `VideoPlayer` includes built-in gesture support for common interactions like double-tapping to seek and tapping to toggle controls. You can also integrate custom gestures using `react-native-gesture-handler`.

For more advanced gesture customization, refer to the `useGestures` hook and `TapHandler`/`PanHandler` components in the source code.
