package com.bare

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.content.Intent
import android.content.res.Configuration
import com.orientationdirector.implementation.ConfigurationChangedBroadcastReceiver

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "bare"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

      override fun onConfigurationChanged(newConfig: Configuration) {
      super.onConfigurationChanged(newConfig)

      val orientationDirectorCustomAction =
        "${packageName}.${ConfigurationChangedBroadcastReceiver.CUSTOM_INTENT_ACTION}"

      val intent =
        Intent(orientationDirectorCustomAction).apply {
          putExtra("newConfig", newConfig)
          setPackage(packageName)
        }

      this.sendBroadcast(intent)
  }
}
