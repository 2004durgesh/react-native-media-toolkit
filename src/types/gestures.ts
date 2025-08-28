import type { GestureUpdateEvent, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';

/**
 * Props for the useDoubleTapGesture hook.
 */
export interface UseDoubleTapGestureProps {
  /**
   * A ref to the video component.
   */
  videoRef: React.RefObject<any> | null;
  /**
   * The interval in seconds to seek forward or backward when double tapping.
   */
  doubleTapSeekInterval?: number;
  /**
   * A callback function that is called when a double tap seek starts.
   */
  onDoubleTapSeekStart?: () => void;
  /**
   * A callback function that is called when a double tap seek ends.
   */
  onDoubleTapSeekEnd?: () => void;
}

/**
 * Props for the usePanGesture hook.
 */
export interface UsePanGestureProps {
  /**
   * A callback function that is called when a vertical pan gesture is performed on the left side of the screen.
   */
  onLeftVerticalPan?: (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => void;
  /**
   * A callback function that is called when a vertical pan gesture is performed on the right side of the screen.
   */
  onRightVerticalPan?: (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => void;
  /**
   * A callback function that is called when a vertical pan gesture is performed anywhere on the screen.
   */
  onGlobalVerticalPan?: (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => void;
}

/**
 * Props for the GestureHandler component.
 */
export interface GestureHandlerProps extends Partial<UseDoubleTapGestureProps>, Partial<UsePanGestureProps> {
  /**
   * The children to render inside the gesture handler.
   */
  children?: React.ReactNode;
}
