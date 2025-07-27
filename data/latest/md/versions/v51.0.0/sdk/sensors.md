---
title: Sensors
description: A library that provides access to a device's accelerometer, barometer, motion, gyroscope, light, magnetometer, and pedometer.
sourceCodeUrl: https://github.com/expo/expo/tree/sdk-51/packages/expo-sensors
packageName: expo-sensors
iconUrl: /static/images/packages/expo-sensors.png
platforms: ["android", "ios", "web"]
---

`expo-sensors` provide various APIs for accessing device sensors to measure motion, orientation, pressure, magnetic fields, ambient light, and step count.

## Installation

## API

```js

// OR
import {
  Accelerometer,
  Barometer,
  DeviceMotion,
  Gyroscope,
  LightSensor,
  Magnetometer,
  MagnetometerUncalibrated,
  Pedometer,
} from 'expo-sensors';
```

## Permissions

### Android

Starting in Android 12 (API level 31), the system has a 200Hz limit for each sensor updates.

If you need an update interval of less than 200Hz, you must add the following permissions to your **app.json** inside the [`expo.android.permissions`](../config/app/#permissions) array.

If you're not using Continuous Native Generation ([CNG](/workflow/continuous-native-generation/)) or you're using native **android** project manually, add `HIGH_SAMPLING_RATE_SENSORS` permission to your project's **android/app/src/main/AndroidManifest.xml**:

```xml
<uses-permission android:name="android.permission.HIGH_SAMPLING_RATE_SENSORS" />
```

## Available sensors

For more information, see the documentation for the sensor you are interested in: