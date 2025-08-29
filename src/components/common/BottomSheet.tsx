import React, { useEffect, type FC, type ReactNode } from 'react';
import { StyleSheet, View, Dimensions, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useVideo } from '../../providers';
import { Portal } from '@rn-primitives/portal';

interface BottomSheetProps {
  visible: boolean;
  onClose?: () => void;
  children: ReactNode;
}

const { height, width } = Dimensions.get('window');

/**
 * `BottomSheet` is a customizable, animated bottom sheet component.
 * It provides a modal-like overlay that slides up from the bottom of the screen,
 * and can be dismissed by swiping down or tapping outside.
 * It integrates with the video player's theme and handles fullscreen mode adjustments.
 *
 * @param {object} props - The props for the BottomSheet component.
 * @param {boolean} props.visible - Controls the visibility of the bottom sheet. When `true`, the sheet slides up.
 * @param {() => void} [props.onClose] - Callback function invoked when the bottom sheet is requested to close (e.g., by swiping down or tapping the overlay).
 * @param {ReactNode} props.children - The content to be rendered inside the bottom sheet.
 *
 * @returns {JSX.Element | null} The BottomSheet component, or `null` if not visible.
 */
const BottomSheet: FC<BottomSheetProps> = ({
  visible,
  onClose,
  children,
}: {
  visible: boolean;
  onClose?: () => void;
  children: ReactNode;
}): JSX.Element | null => {
  const { state } = useVideo();
  const { theme, fullscreen } = state;
  const SHEET_HEIGHT = fullscreen ? width * 0.85 : height * 0.45;
  const SHEET_WIDTH = fullscreen ? height * 0.75 : width * 0.9;
  const translateY = useSharedValue(SHEET_HEIGHT);

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
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Portal name="sheet-portal">
      <View style={[styles.container, { backgroundColor: theme.colors.overlay }]}>
        <Pressable style={{ height, width }} onPress={onClose} />
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[
              styles.sheetContainer,
              animatedStyle,
              {
                backgroundColor: theme.colors.background,
                height: SHEET_HEIGHT,
                width: SHEET_WIDTH,
                borderRadius: 16,
                overflow: 'hidden',
              },
            ]}>
            {children}
          </Animated.View>
        </GestureDetector>
      </View>
    </Portal>
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
