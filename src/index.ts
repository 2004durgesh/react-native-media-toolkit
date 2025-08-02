// Main VideoPlayer component and compound components
export { VideoPlayer, DefaultSkin, MinimalSkin } from './components/VideoPlayer';

// Core components
export { VideoOverlay } from './components/core/VideoOverlay';
export { VideoSurface } from './components/core/VideoSurface';

// Basic controls
export { PlayButton } from './components/controls/basic/PlayButton';
export { ProgressBar } from './components/controls/basic/ProgressBar';
export { TimeDisplay } from './components/controls/basic/TimeDisplay';
export { VolumeControl } from './components/controls/basic/VolumeControl';

// Control component prop types
export type { PlayButtonProps } from './components/controls/basic/PlayButton';
export type { ProgressBarProps } from './components/controls/basic/ProgressBar';
export type { TimeDisplayProps } from './components/controls/basic/TimeDisplay';
export type { VolumeControlProps } from './components/controls/basic/VolumeControl';

// Store
export { VideoProvider, useVideo, useVideoState, useVideoActions, useVideoConfig, useVideoTheme } from './store';

// Types
export type * from './types';
