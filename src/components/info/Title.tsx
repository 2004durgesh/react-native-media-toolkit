import { Text, StyleSheet, type StyleProp, type TextStyle } from 'react-native';
import { useVideo } from '../../providers';

export const Title = ({ text, style }: { text: string; style?: StyleProp<TextStyle> }) => {
  const {
    state: { theme },
  } = useVideo();
  return <Text style={[styles.title, { color: theme.colors.text }, style]}>{text}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
