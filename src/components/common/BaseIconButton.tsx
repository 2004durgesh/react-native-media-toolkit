import React from 'react';
import { type TouchableWithoutFeedbackProps, View } from 'react-native';
import { useVideo } from '../../providers';
import Ripple from 'react-native-material-ripple';

interface BaseIconButtonProps extends TouchableWithoutFeedbackProps {
  IconComponent: React.ElementType;
  size?: number;
  color?: string;
}

/**
 * `BaseIconButton` is a foundational component for creating interactive icon buttons within the video player.
 * It wraps an `IconComponent` with a ripple effect provided by `react-native-material-ripple`,
 * and integrates with the player's theme for consistent sizing and coloring.
 *
 * @param {object} props - The props for the BaseIconButton component.
 * @param {React.ElementType} props.IconComponent - The icon component to render inside the button (e.g., from `@expo/vector-icons` or a custom SVG component).
 * @param {number} [props.size] - Optional size for the icon. If not provided, it defaults to `theme.iconSizes.md`.
 * @param {string} [props.color] - Optional color for the icon. If not provided, it defaults to `theme.colors.text`.
 * @param {TouchableWithoutFeedbackProps} [props.rest] - Additional props passed directly to the underlying `TouchableWithoutFeedback` component.
 *
 * @returns {React.ReactElement} A touchable icon button with a ripple effect.
 */
export const BaseIconButton = ({ IconComponent, size, color, ...props }: BaseIconButtonProps): React.ReactElement => {
  const {
    state: { theme },
  } = useVideo();

  const iconColor = color || theme.colors.text;
  const iconSize = size || theme.iconSizes.md;

  return (
    // @ts-ignore
    <Ripple rippleDuration={500} rippleColor={theme.colors.accent} {...props}>
      <View collapsable={false} style={{ padding: 10 }}>
        <IconComponent size={iconSize} color={iconColor} />
      </View>
    </Ripple>
  );
};
