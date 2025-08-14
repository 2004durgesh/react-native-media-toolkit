import { Text, StyleSheet, View } from 'react-native';
import { useProgress } from '../../../hooks/media/useProgress';
import { useVideo } from '../../../components/providers/VideoProvider';

export interface TimeDisplayProps {
  showRemaining?: boolean;
  fontSize?: number;
  color?: string;
  style?: any;
}

export const TimeDisplay = ({ showRemaining, fontSize = 14, color, style }: TimeDisplayProps) => {
  const { currentTime, duration } = useProgress();
  const {
    state: { config, theme },
  } = useVideo();

  const textColor = color || theme.colors.text;

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${Math.floor(s % 60)
      .toString()
      .padStart(2, '0')}`;
  const useRemaining = showRemaining ?? config.showTimeRemaining;

  return (
    <View style={[styles.timeContainer, style]}>
      <Text style={[styles.timeText, { fontSize, color: textColor }]}>{formatTime(currentTime)}</Text>
      <Text style={[styles.separator, { fontSize, color: textColor }]}>{useRemaining ? ' - ' : ' / '}</Text>
      <Text style={[styles.timeText, { fontSize, color: textColor }]}>
        {useRemaining ? formatTime(duration - currentTime) : formatTime(duration)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  separator: {
    fontWeight: '400',
    opacity: 0.8,
  },
});
