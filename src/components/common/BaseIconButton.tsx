import React from 'react';
import { Pressable, type PressableProps } from 'react-native';
import { useVideo } from '../../providers';

interface BaseIconButtonProps extends PressableProps {
  IconComponent: React.ElementType;
  size?: number;
  color?: string;
}

export const BaseIconButton = ({ IconComponent, size, color, ...props }: BaseIconButtonProps) => {
  const {
    state: { theme },
  } = useVideo();

  const iconColor = color || theme.colors.text;
  const iconSize = size || theme.iconSizes.md;

  return (
    <Pressable {...props}>
      <IconComponent size={iconSize} color={iconColor} />
    </Pressable>
  );
};
