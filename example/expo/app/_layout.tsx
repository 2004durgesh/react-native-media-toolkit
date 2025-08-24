import React from 'react';
import { View, Button } from 'react-native';
import { Link, Slot } from 'expo-router';

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <Slot />
    </View>
  );
}
