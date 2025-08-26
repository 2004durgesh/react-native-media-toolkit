import type { GestureUpdateEvent, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';

export interface UseDoubleTapGestureProps {
  videoRef: React.RefObject<any> | null;
  doubleTapSeekInterval?: number;
  onDoubleTapSeekStart?: () => void;
  onDoubleTapSeekEnd?: () => void;
}

export interface UsePanGestureProps {
  onLeftVerticalPan?: (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => void;
  onRightVerticalPan?: (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => void;
  onGlobalVerticalPan?: (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => void;
}

export interface GestureHandlerProps extends Partial<UseDoubleTapGestureProps>, Partial<UsePanGestureProps> {
  children?: React.ReactNode;
}
