import { Tabs } from 'expo-router';
import React from 'react';
import {Ionicons} from '@expo/vector-icons';

export const unstable_settings = {
  initialRouteName: 'index',
};
export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor:'black',
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="skins"
        options={{
          title: 'Skins',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="planet" color={color} />,
        }}
      />
    </Tabs>
  );
}
