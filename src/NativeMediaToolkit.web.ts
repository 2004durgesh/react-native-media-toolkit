/// <reference lib="dom" />
/**
 * @file NativeMediaToolkit.web.ts
 * @description This file provides a web implementation of the NativeMediaToolkit module.
 */

export interface Spec {
  enterFullscreen(): Promise<boolean>;
  exitFullscreen(): Promise<boolean>;
  isFullscreen(): Promise<boolean>;
}

export const NativeMediaToolkit: Spec = {
  enterFullscreen: async (): Promise<boolean> => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Failed to enter fullscreen:', error);
      return false;
    }
  },
  exitFullscreen: async (): Promise<boolean> => {
    try {
      if (document.exitFullscreen && document.fullscreenElement) {
        await document.exitFullscreen();
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Failed to exit fullscreen:', error);
      return false;
    }
  },
  isFullscreen: async (): Promise<boolean> => {
    return document.fullscreenElement !== null;
  },
};

export default NativeMediaToolkit;
