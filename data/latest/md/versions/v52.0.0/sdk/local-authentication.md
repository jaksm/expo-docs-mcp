---
title: LocalAuthentication
description: A library that provides functionality for implementing the Fingerprint API (Android) or FaceID and TouchID (iOS) to authenticate the user with a face or fingerprint scan.
sourceCodeUrl: https://github.com/expo/expo/tree/sdk-52/packages/expo-local-authentication
packageName: expo-local-authentication
iconUrl: /static/images/packages/expo-local-authentication.png
platforms: ["android", "ios"]
---

import {
  ConfigReactNative,
  ConfigPluginExample,
  ConfigPluginProperties,
} from '~/ui/components/ConfigSection';

`expo-local-authentication` allows you to use the Biometric Prompt (Android) or FaceID and TouchID (iOS) to authenticate the user with a fingerprint or face scan.

## Known limitation

### iOS&ensp;

The FaceID authentication for iOS is not supported in Expo Go. You will need to create a [development build](/develop/development-builds/introduction/) to test FaceID.

## Installation

## Configuration in app config

You can configure `expo-local-authentication` using its built-in [config plugin](/config-plugins/introduction/) if you use config plugins in your project ([EAS Build](/build/introduction) or `npx expo run:[android|ios]`). The plugin allows you to configure various properties that cannot be set at runtime and require building a new app binary to take effect.

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-local-authentication",
        {
          "faceIDPermission": "Allow $(PRODUCT_NAME) to use Face ID."
        }
      ]
    ]
  }
}
```

If you're not using Continuous Native Generation ([CNG](/workflow/continuous-native-generation/)) or you're using a native **ios** project manually, then you need to add `NSFaceIDUsageDescription` key to your **ios/[app]/Info.plist**:

```xml Info.plist
<key>NSFaceIDUsageDescription</key>
<string>Allow $(PRODUCT_NAME) to use FaceID</string>
```

## API

```js

```

## Permissions

### Android

The following permissions are added automatically through this library's **AndroidManifest.xml**:

### iOS

The following usage description keys are used by this library: