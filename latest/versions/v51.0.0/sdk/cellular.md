---
title: Cellular
description: An API that provides information about the user's cellular service provider.
sourceCodeUrl: https://github.com/expo/expo/tree/sdk-51/packages/expo-cellular
packageName: expo-cellular
iconUrl: /static/images/packages/expo-cellular.png
platforms: ["android", "ios", "web"]
---

`expo-cellular` provides information about the user's cellular service provider, such as its unique identifier, cellular connection type, and whether it allows VoIP calls on its network.

## Installation

## Configuration

If you're not using Continuous Native Generation ([CNG](/workflow/continuous-native-generation/)) or you're using native a **android** project manually, then you need to add `android.permission.READ_PHONE_STATE` permission to your project's **AndroidManifest.xml**. This permission is used for `TelephonyManager`.

```xml android/app/src/main/AndroidManifest.xml
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
```

This library does not require the more risky `READ_PRIVILEGED_PHONE_STATE` permission.

## API

```js

```

## Error codes

| Code                                         | Description                                                          |
| -------------------------------------------- | -------------------------------------------------------------------- |
| ERR_CELLULAR_GENERATION_UNKNOWN_NETWORK_TYPE | Unable to access network type or not connected to a cellular network |

## Permissions

### Android

You must add the following permissions to your **app.json** inside the [`expo.android.permissions`](../config/app/#permissions) array.

### iOS

_No permissions required_.