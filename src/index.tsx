// Main VideoPlayer component and compound components
export { VideoPlayer } from './components/VideoPlayer';

// Export Skins components
export { DefaultSkin, MinimalSkin } from './skins';

// Core components
export { VideoOverlay, VideoSurface } from './components/core';

// Basic controls and their types
export { PlayButton, ProgressBar, TimeDisplay, VolumeControl } from './components/controls/basic';
export type {
  PlayButtonProps,
  ProgressBarProps,
  TimeDisplayProps,
  VolumeControlProps,
} from './components/controls/basic';

// Store
export { useVideo } from './components/providers/VideoProvider';

// Types
export type * from './types';
