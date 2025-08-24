import React from 'react';
import { MinimalLayout, ThemeProvider, minimalTheme } from 'react-native-media-toolkit';
import { ScreenLayout } from './components/ScreenLayout';

export default function Index() {
  return <ScreenLayout layout={<MinimalLayout />} />;
}
