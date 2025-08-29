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
 * A base icon button component.
 *
 * @param {BaseIconButtonProps} props - The props for the component.
 * @returns {React.ReactElement} - The base icon button component.
 */
export const BaseIconButton = ({ IconComponent, size, color, ...props }: BaseIconButtonProps) => {
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
