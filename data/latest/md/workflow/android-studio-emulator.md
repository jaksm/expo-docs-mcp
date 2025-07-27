---
title: Android Studio Emulator
description: Learn how to set up the Android Emulator to test your app on a virtual Android device.
---

If you don't have an Android device available to test with, we recommend using the default emulator that comes with Android Studio. If you run into any problems setting it up, follow the steps in this guide.

## Troubleshooting

### Multiple `adb` versions

Having multiple `adb` versions on your system can result in the following error:

This is because the `adb` version on your system is different from the `adb` version on the Android SDK platform-tools.

Open the terminal and check the `adb` version on the system:

And from the Android SDK platform-tool directory:

Copy `adb` from Android SDK directory to `usr/bin` directory: