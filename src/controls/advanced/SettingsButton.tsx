import { StyleSheet } from 'react-native';
import { useSettings } from '../../hooks';
import { Settings } from 'lucide-react-native';
import { BaseIconButton } from '../../components/common/BaseIconButton';
import { GestureDetector } from 'react-native-gesture-handler';

export interface SettingsButtonProps {
  size?: number;
  color?: string;
  style?: any;
  renderSettingIcon?: () => React.ReactNode;
}

/**
 * A button that plays and pauses the video.
 *
 * @param {SettingsButtonProps} props - The props for the component.
 * @returns {React.ReactElement} - The play button component.
 */
export const SettingsButton = ({ size, color, style, renderSettingIcon }: SettingsButtonProps): React.ReactElement => {
  const { isSettingsMenuVisible, settingsTapGesture } = useSettings();
  const SettingsIcon = renderSettingIcon || Settings;
  return (
    <GestureDetector gesture={settingsTapGesture}>
      <BaseIconButton IconComponent={SettingsIcon} size={size} color={color} style={[styles.SettingsButton, style]} />
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  SettingsButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
