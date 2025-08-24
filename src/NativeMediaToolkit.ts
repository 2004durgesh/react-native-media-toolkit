/**
 * @file NativeMediaToolkit.ts
 * @description This file defines the interface and implementation for the NativeMediaToolkit module,
 * which provides methods to manage fullscreen mode in a React Native application.
 * It uses React Native's TurboModule system to interact with native code.
 * The module includes methods to enter and exit fullscreen mode, as well as to check if the
 * application is currently in fullscreen mode.
 */

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  enterFullscreen(): Promise<boolean>;
  exitFullscreen(): Promise<boolean>;
  isFullscreen(): Promise<boolean>;
}

export const NativeMediaToolkit = TurboModuleRegistry.getEnforcing<Spec>('MediaToolkit');
export default NativeMediaToolkit;
