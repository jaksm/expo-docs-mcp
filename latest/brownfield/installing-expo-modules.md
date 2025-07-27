---
title: Install Expo modules in an existing native project
sidebar_title: Install Expo modules
description: Learn how to prepare your existing native project to install and use Expo modules and the module API.
---

> **info** If your project is a **greenfield React Native app** &mdash; primarily built with React Native from the start, then see [Install Expo modules in an existing React Native project](/bare/installing-expo-modules/) instead of this guide.

This guide provides the steps to prepare your existing native project to install and use Expo modules and the module API.

## Prerequisites

> **warning** The following instructions may not work for all projects. Support for integrating Expo modules into existing projects is still experimental. If you encounter issues, [create an issue on GitHub](https://github.com/expo/expo/issues).

You should have a brownfield native project with React Native installed and configured to render a root view. If you don't have this yet, follow the [Integration with Existing Apps](https://reactnative.dev/docs/integration-with-existing-apps) guide from the React Native documentation and then come back here once you have followed the steps.

## Install the `expo` package

Add the `expo` package to your project. Ensure you are using a version of [the `expo` package that is compatible with the React Native version in your project](/versions/latest/#each-expo-sdk-version-depends-on-a-react-native-version).

## Configuring native apps

### Android app

Add the following to the **gradle.properties** file in the **android** directory:

Add the following to the **setting.gradle** file in the **android** directory:

Inside the **android** directory, run the following command:

Once the above command completes, run:

**(Optional)** Complete the following steps if you would like to use [lifecycle listeners](/modules/android-lifecycle-listeners/) in your app. If you do not set up lifecycle listeners, then additional setup will be required for each module that uses them.

<Step label="4.1">

If you already have a class that extends the `Application` class you can move to step 3. If you do not have it, we need to create one. Add a file called **MainApplication.kt** file to your **android/app/src/main/java/com/&lt;your-app-package&gt;** directory with the following content:

<DiffBlock
  raw={`diff --git a/android/app/src/main/java/com/<my-app-package>/MainApplication.kt b/android/app/src/main/java/com/<my-app-package>/MainApplication.kt
new file mode 100644
index 0000000..2c8525a
--- /dev/null
+++ b/android/app/src/main/java/com/<my-app-package>/MainApplication.kt
@@ -0,0 +1,19 @@
+package <my.app.package>
+
+import android.app.Application
+import android.content.res.Configuration
+import com.facebook.soloader.SoLoader
+import expo.modules.ApplicationLifecycleDispatcher
+
+class MainApplication() : Application() {
+    override fun onCreate() {
+        super.onCreate()
+        ApplicationLifecycleDispatcher.onApplicationCreate(this)
+    }
+
+    override fun onConfigurationChanged(newConfig: Configuration) {
+        super.onConfigurationChanged(newConfig)
+        ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
+    }
+}`}
/>

Register the class in the **AndroidManifest.xml** file.

If you have your own class extending `Application`, you can add the following. It includes calls to `ApplicationLifecycleDispatcher` for handling events at the application startup and during device configuration changes.

<DiffBlock raw={`diff --git a/android/app/src/main/java/com/<my-app-package>/MainApplication.kt b/android/app/src/main/java/com/<my-app-package>/MainApplication.kt
new file mode 100644
index 0000000..2c8525a
--- /dev/null
+++ b/android/app/src/main/java/com/<my-app-package>/MainApplication.kt
@@ -0,0 +1,19 @@
class MainApplication() : Application() {
    override fun onCreate() {
        super.onCreate()
+       ApplicationLifecycleDispatcher.onApplicationCreate(this)
    }
+
+   override fun onConfigurationChanged(newConfig: Configuration) {
+       super.onConfigurationChanged(newConfig)
+       ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
+   }

}`}
/>

Override `onConfigurationChanged` if you have not done so already.

</Step>

### iOS app

Add the following to your `Podfile` in the **ios** directory:

<DiffBlock
  raw={`
diff --git a/ios/Podfile b/ios/Podfile
index f991b7b..17c24b0 100644
--- a/ios/Podfile
+++ b/ios/Podfile
@@ -1 +1,4 @@
+# Expo requires
+require File.join(File.dirname(\`node --print "require.resolve('expo/package.json')"\`), "scripts/autolinking")
+
 # Resolve react_native_pods.rb with node to allow for hoisting
@@ -17,3 +20,16 @@ end
 target '<YourAppTarget>' do
-  config = use_native_modules!()
+  # Need to be added inside the target block
+  use_expo_modules!
+
+  config_command = [
+    'node',
+    '--no-warnings',
+    '--eval',
+    'require(require.resolve("expo-modules-autolinking", { paths: [require.resolve("expo/package.json")] }))(process.argv.slice(1))',
+    'react-native-config',
+    '--json',
+    '--platform',
+    'ios'
+  ]
+  config = use_native_modules!(config_command)
 `}
/>

Open your **ios** directory in Xcode. From the project navigator, select your project and then select your app target under `TARGETS`. In `Build Settings`, using the search bar, search for `ENABLE_USER_SCRIPT_SANDBOXING`. If it is not already, set its value to `No`.

Run `pod install` in the **ios** directory.

You will need to do this every time you add a dependency that uses native code.

**(Optional)** Complete the following if you would like to use [`AppDelegate` subscribers](/modules/appdelegate-subscribers/). If you do not set up `AppDelegate` subscribers, then additional setup will be required for each module that uses them.

<DiffBlock raw={`diff --git a/ios/<MyAppProject>/AppDelegate.swift b/ios/<MyAppProject>/AppDelegate.swift
index ff83531..bd8651d 100644
--- a/ios/<MyAppProject>/AppDelegate.swift
+++ b/ios/<MyAppProject>/AppDelegate.swift
@@ -1,31 +1,29 @@
 import UIKit
+import ExpoModulesCore

@main
-class AppDelegate: UIResponder, UIApplicationDelegate {
+class AppDelegate: ExpoAppDelegate {

- func application(\_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

+override func application(\_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

- return true

+super.application(application, didFinishLaunchingWithOptions: launchOptions)
}
`}
/>