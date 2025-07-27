---
title: Sensors
description: A library that provides access to a device's accelerometer, barometer, motion, gyroscope, light, magnetometer, and pedometer.
sourceCodeUrl: https://github.com/expo/expo/tree/sdk-52/packages/expo-sensors
packageName: expo-sensors
iconUrl: /static/images/packages/expo-sensors.png
platforms: ["android", "ios", "web"]
---

import {
  ConfigReactNative,
  ConfigPluginExample,
  ConfigPluginProperties,
} from '~/ui/components/ConfigSection';

`expo-sensors` provide various APIs for accessing device sensors to measure motion, orientation, pressure, magnetic fields, ambient light, and step count.

## Installation

## Configuration in app config

You can configure `expo-sensors` using its built-in [config plugin](/config-plugins/introduction/) if you use config plugins in your project ([EAS Build](/build/introduction) or `npx expo run:[android|ios]`). The plugin allows you to configure various properties that cannot be set at runtime and require building a new app binary to take effect.

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-sensors",
        {
          "motionPermission": "Allow $(PRODUCT_NAME) to access your device motion"
        }
      ]
    ]
  }
}
```

If you're not using Continuous Native Generation ([CNG](/workflow/continuous-native-generation/)) or you're using native **android** project manually, add `HIGH_SAMPLING_RATE_SENSORS` permission to your project's **android/app/src/main/AndroidManifest.xml**:

```xml
<uses-permission android:name="android.permission.HIGH_SAMPLING_RATE_SENSORS" />
```

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

### iOS

The following usage description keys are used by this library:

## Available sensors

For more information, see the documentation for the sensor you are interested in: