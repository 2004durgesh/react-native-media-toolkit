import { ActivityIndicator, StyleSheet } from 'react-native';
import { useBuffering } from '../../hooks';
import { useVideo } from '../../providers';

export interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  style?: any;
}

export const LoadingSpinner = ({ size = 'large', color, style }: LoadingSpinnerProps) => {
  const { buffering } = useBuffering();
  const {
    state: { theme },
  } = useVideo();

  const spinnerColor = color || theme.colors.primary;

  if (!buffering) {
    return null;
  }

  return <ActivityIndicator size={size} color={spinnerColor} style={[styles.spinner, style]} />;
};

const styles = StyleSheet.create({
  spinner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
});
