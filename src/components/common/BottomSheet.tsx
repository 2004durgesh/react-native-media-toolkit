import React, { useEffect, type FC, type ReactNode } from 'react';
import { StyleSheet, View, Dimensions, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useVideo } from '../../providers';

interface BottomSheetProps {
  visible: boolean;
  onClose?: () => void;
  children: ReactNode;
}

const { height, width } = Dimensions.get('window');

const BottomSheet: FC<BottomSheetProps> = ({ visible, onClose, children }) => {
  const { state } = useVideo();
  const { theme, fullscreen } = state;
  const SHEET_HEIGHT = fullscreen ? height * 0.95 : height * 0.45;
  const translateY = useSharedValue(SHEET_HEIGHT);
  // Animate open/close
  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 300 });
    } else {
      translateY.value = withTiming(SHEET_HEIGHT, { duration: 300 });
    }
  }, [visible, SHEET_HEIGHT, translateY]);

  // Pan gesture to swipe down
  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > SHEET_HEIGHT / 3) {
        translateY.value = withTiming(SHEET_HEIGHT, { duration: 200 });
        if (onClose) runOnJS(onClose)();
      } else {
        translateY.value = withTiming(0, { duration: 200 });
      }
    });

  // Animated style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.overlay }]}>
      {/* backdrop */}
      <Pressable style={{ height, width }} onPress={onClose} />
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.sheetContainer,
            animatedStyle,
            {
              backgroundColor: theme.colors.background,
              height: SHEET_HEIGHT,
              width: width * 0.9,
              borderRadius: 16,
              overflow: 'hidden',
            },
          ]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheetContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
    padding: 16,
  },
});
