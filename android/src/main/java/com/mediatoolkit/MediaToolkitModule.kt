package com.mediatoolkit

import android.app.Activity
import android.os.Build
import android.view.View
import android.view.Window
import android.view.WindowInsets
import android.view.WindowInsetsController
import android.view.WindowManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = MediaToolkitModule.NAME)
class MediaToolkitModule(reactContext: ReactApplicationContext) :
  NativeMediaToolkitSpec(reactContext) {

  private var isCurrentlyFullscreen = false

  companion object {
    const val NAME = "MediaToolkit"
    private const val INSETS_TYPE_HIDE = 0
    private const val INSETS_TYPE_SHOW = 1
    private const val INSETS_TYPE_BEHAVIOR = 2
    private const val INSETS_TYPE_APPEARANCE_CLEAR = 3
  }

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  override fun enterFullscreen(promise: Promise) {
    stickyImmersive(true, promise)
  }

  @ReactMethod
  override fun exitFullscreen(promise: Promise) {
    stickyImmersive(false, promise)
  }

  @ReactMethod
  fun stickyImmersive(enabled: Boolean, promise: Promise) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      val visibility = WindowInsets.Type.navigationBars() or WindowInsets.Type.statusBars()
      if (enabled) {
        setSystemInsetsController(visibility, INSETS_TYPE_HIDE, promise)
        setSystemInsetsController(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE, INSETS_TYPE_BEHAVIOR, promise)
      } else {
        setSystemInsetsController(visibility, INSETS_TYPE_SHOW, promise)
        setSystemInsetsController(WindowInsetsController.BEHAVIOR_SHOW_BARS_BY_SWIPE, INSETS_TYPE_APPEARANCE_CLEAR, promise)
      }
    } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
      if (enabled) {
        setSystemUIFlags(
          View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or
            View.SYSTEM_UI_FLAG_FULLSCREEN or
            View.SYSTEM_UI_FLAG_HIDE_NAVIGATION,
          promise
        )
      } else {
        setSystemUIFlags(View.SYSTEM_UI_FLAG_VISIBLE, promise)
      }
    } else {
      promise.resolve(false)
    }
    isCurrentlyFullscreen = enabled
  }

  @ReactMethod
  fun fullScreen(enabled: Boolean, promise: Promise) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      val visibility = WindowInsets.Type.navigationBars() or WindowInsets.Type.statusBars()
      val type = if (enabled) INSETS_TYPE_HIDE else INSETS_TYPE_SHOW
      setSystemInsetsController(visibility, type, promise)
    } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
      if (enabled) {
        setSystemUIFlags(
          View.SYSTEM_UI_FLAG_LAYOUT_STABLE or
            View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
            View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
            View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
            View.SYSTEM_UI_FLAG_IMMERSIVE or
            View.SYSTEM_UI_FLAG_FULLSCREEN,
          promise
        )
      } else {
        setSystemUIFlags(
          View.SYSTEM_UI_FLAG_LAYOUT_STABLE or
            View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
            View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN,
          promise
        )
      }
    } else {
      promise.resolve(false)
      return
    }
    
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
      val currentActivity = reactApplicationContext.currentActivity
      if (currentActivity == null) {
        promise.reject("Error", "current activity is null")
        return
      }
      val window = currentActivity.window
      UiThreadUtil.runOnUiThread {
        window.clearFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS)
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION)
        if (enabled) {
          window.setFlags(
            WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION,
            WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION
          )
        }
      }
    }
    isCurrentlyFullscreen = enabled
  }

  private fun setSystemInsetsController(visibility: Int, type: Int, promise: Promise) {
    val currentActivity = reactApplicationContext.currentActivity
    if (currentActivity == null) {
      promise.reject("Error", "current activity is null")
      return
    }

    UiThreadUtil.runOnUiThread {
      try {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
          val controller = currentActivity.window.insetsController
          if (controller != null) {
            when (type) {
              INSETS_TYPE_HIDE -> controller.hide(visibility)
              INSETS_TYPE_SHOW -> controller.show(visibility)
              INSETS_TYPE_BEHAVIOR -> controller.systemBarsBehavior = visibility
              INSETS_TYPE_APPEARANCE_CLEAR -> controller.systemBarsBehavior = visibility
            }
            promise.resolve(true)
          } else {
            promise.resolve(false)
          }
        } else {
          promise.resolve(false)
        }
      } catch (e: Exception) {
        android.util.Log.e("MediaToolkit", "Error setting system insets controller", e)
        promise.resolve(false)
      }
    }
  }

  private fun setSystemUIFlags(flags: Int, promise: Promise) {
    val currentActivity = reactApplicationContext.currentActivity
    if (currentActivity == null) {
      promise.reject("Error", "current activity is null")
      return
    }

    UiThreadUtil.runOnUiThread {
      try {
        @Suppress("DEPRECATION")
        currentActivity.window.decorView.systemUiVisibility = flags
        promise.resolve(true)
      } catch (e: Exception) {
        android.util.Log.e("MediaToolkit", "Error setting system UI flags", e)
        promise.resolve(false)
      }
    }
  }

  @ReactMethod
  override fun isFullscreen(promise: Promise) {
    val activity = reactApplicationContext.currentActivity
    if (activity == null) {
      promise.resolve(false)
      return
    }

    UiThreadUtil.runOnUiThread {
      try {
        val isFullscreen = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
          // For Android 11+ (API 30+) - Use our internal state as it's most reliable
          isCurrentlyFullscreen
        } else {
          // For Android 10 and below (API 29-) - Check system UI flags
          @Suppress("DEPRECATION") 
          val flags = activity.window.decorView.systemUiVisibility
          (flags and View.SYSTEM_UI_FLAG_FULLSCREEN) != 0
        }
        promise.resolve(isFullscreen)
      } catch (e: Exception) {
        android.util.Log.e("MediaToolkit", "Error checking fullscreen status", e)
        promise.resolve(isCurrentlyFullscreen)
      }
    }
  }
}