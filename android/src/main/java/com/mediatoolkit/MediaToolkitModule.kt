package com.mediatoolkit

import android.app.Activity
import android.os.Build
import android.view.View
import android.view.WindowInsets
import android.view.WindowInsetsController
import android.view.WindowManager
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = MediaToolkitModule.NAME)
class MediaToolkitModule(reactContext: ReactApplicationContext) :
  NativeMediaToolkitSpec(reactContext) {

  private var isCurrentlyFullscreen = false

  override fun getName(): String {
    return NAME
  }

  override fun enterFullscreen(promise: Promise) {
    UiThreadUtil.runOnUiThread {
      try {
        val activity = currentActivity
        if (activity == null) {
          promise.reject("NO_ACTIVITY", "No current activity found")
          return@runOnUiThread
        }

        enterFullscreenMode(activity)
        isCurrentlyFullscreen = true
        promise.resolve(true)
      } catch (e: Exception) {
        promise.reject("FULLSCREEN_ERROR", "Failed to enter fullscreen: ${e.message}", e)
      }
    }
  }

  override fun exitFullscreen(promise: Promise) {
    UiThreadUtil.runOnUiThread {
      try {
        val activity = currentActivity
        if (activity == null) {
          promise.reject("NO_ACTIVITY", "No current activity found")
          return@runOnUiThread
        }

        exitFullscreenMode(activity)
        isCurrentlyFullscreen = false
        promise.resolve(true)
      } catch (e: Exception) {
        promise.reject("FULLSCREEN_ERROR", "Failed to exit fullscreen: ${e.message}", e)
      }
    }
  }

  override fun isFullscreen(promise: Promise) {
    promise.resolve(isCurrentlyFullscreen)
  }

  private fun enterFullscreenMode(activity: Activity) {
    val window = activity.window
    val decorView = window.decorView

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      // Android 11+ (API 30+) - New WindowInsetsController approach
      val controller = window.insetsController
      controller?.let {
        it.hide(WindowInsets.Type.statusBars() or WindowInsets.Type.navigationBars())
        it.systemBarsBehavior = WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
      }
    } else {
      // Android 4.4+ (API 19-29) - Use WindowInsetsControllerCompat
      val insetsController = ViewCompat.getWindowInsetsController(decorView)
      insetsController?.let {
        it.hide(WindowInsetsCompat.Type.statusBars() or WindowInsetsCompat.Type.navigationBars())
        it.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
      }
      
      // Fallback for devices that don't support WindowInsetsControllerCompat properly
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
        @Suppress("DEPRECATION")
        decorView.systemUiVisibility = (
          View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            or View.SYSTEM_UI_FLAG_FULLSCREEN
            or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        )
      }
    }

    // Additional window flags for better fullscreen experience
    window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
    
    // Handle notch/cutout areas for newer devices
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
      val layoutParams = window.attributes
      layoutParams.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
      window.attributes = layoutParams
    }
  }

  private fun exitFullscreenMode(activity: Activity) {
    val window = activity.window
    val decorView = window.decorView

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      // Android 11+ (API 30+)
      val controller = window.insetsController
      controller?.let {
        it.show(WindowInsets.Type.statusBars() or WindowInsets.Type.navigationBars())
        it.systemBarsBehavior = WindowInsetsController.BEHAVIOR_DEFAULT
      }
    } else {
      // Android 4.4+ (API 19-29)
      val insetsController = ViewCompat.getWindowInsetsController(decorView)
      insetsController?.let {
        it.show(WindowInsetsCompat.Type.statusBars() or WindowInsetsCompat.Type.navigationBars())
        it.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_DEFAULT
      }
      
      // Fallback for older devices
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
        @Suppress("DEPRECATION")
        decorView.systemUiVisibility = (
          View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        )
      }
    }

    // Remove fullscreen flags
    window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
    
    // Reset cutout mode
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
      val layoutParams = window.attributes
      layoutParams.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_DEFAULT
      window.attributes = layoutParams
    }
  }

  companion object {
    const val NAME = "MediaToolkit"
  }
}