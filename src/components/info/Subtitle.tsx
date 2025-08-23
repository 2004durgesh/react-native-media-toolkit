import React from 'react';
import { Text, StyleSheet, type StyleProp, type TextStyle } from 'react-native';
import { useVideo } from '../../providers';

export const Subtitle = ({ text, style }: { text: string; style?: StyleProp<TextStyle> }) => {
  const {
    state: { theme },
  } = useVideo();
  return <Text style={[styles.subtitle, { color: theme.colors.text }, style]}>{text}</Text>;
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
});
