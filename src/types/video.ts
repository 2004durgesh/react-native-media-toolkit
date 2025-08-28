/**
 * Represents the source of the video to be played.
 */
export interface VideoSource {
  /**
   * The URI of the video. This can be a remote URL or a local file path.
   */
  uri: string;
  /**
   * The type of the video. For example, 'video/mp4'.
   */
  type?: string;
  /**
   * The headers to be sent with the request for the video.
   */
  headers?: Record<string, string>;
}

/**
 * Represents the state of the video player.
 */
export interface VideoState {
  /**
   * Whether the video is currently playing.
   */
  isPlaying: boolean;
  /**
   * The current time of the video in seconds.
   */
  currentTime: number;
  /**
   * The duration of the video in seconds.
   */
  duration: number;
  /**
   * Whether the video is currently buffering.
   */
  buffering: boolean;
  /**
   * Whether the video is muted.
   */
  muted: boolean;
  /**
   * The volume of the video, between 0 and 1.
   */
  volume: number;
  /**
   * The playback rate of the video.
   */
  playbackRate: number;
  /**
   * Whether the video is in fullscreen mode.
   */
  fullscreen: boolean;
  /**
   * An error message, if any.
   */
  error: string | null;
}

/**
 * Represents the configuration for the video player.
 */
export interface VideoPlayerConfig {
  /**
   * Whether to automatically hide the controls after a certain delay.
   */
  autoHideControls: boolean;
  /**
   * Whether to automatically play the video when it is loaded.
   */
  autoPlay: boolean;
  /**
   * The delay in milliseconds before the controls are hidden.
   */
  autoHideDelay: number;
  /**
   * Whether to enable double tap gestures to seek forward and backward.
   */
  enableDoubleTapGestures: boolean;
  /**
   * Whether to enable the fullscreen button.
   */
  enableFullscreen: boolean;
  /**
   * Whether to enable the volume control.
   */
  enableVolumeControl: boolean;
  /**
   * Whether to enable pan gestures to seek.
   */
  enablePanGestures: boolean;
  /**
   * Whether to enable screen rotation when entering fullscreen.
   */
  enableScreenRotation: boolean;
  /**
   * The available playback rates.
   */
  playbackRates: number[];
  /**
   * A callback function that is called when the player enters fullscreen mode.
   */
  onEnterFullscreen?: () => void;
  /**
   * A callback function that is called when the player exits fullscreen mode.
   */
  onExitFullscreen?: () => void;
  /**
   * A callback function that is called when the controls are hidden.
   */
  onHideControls?: () => void;
  /**
   * A callback function that is called when the controls are shown.
   */
  onShowControls?: () => void;
}
