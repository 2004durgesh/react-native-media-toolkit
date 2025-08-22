import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  enterFullscreen(): Promise<boolean>;
  exitFullscreen(): Promise<boolean>;
  isFullscreen(): Promise<boolean>;
}

export const NativeMediaToolkit = TurboModuleRegistry.getEnforcing<Spec>('MediaToolkit');
export default NativeMediaToolkit;
