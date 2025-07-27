---
title: Device
description: A universal library provides access to system information about the physical device.
sourceCodeUrl: https://github.com/expo/expo/tree/main/packages/expo-device
packageName: expo-device
iconUrl: /static/images/packages/expo-device.png
platforms: ["android", "ios", "tvos", "web"]
---

`expo-device` provides access to system information about the physical device, such as its manufacturer and model.

## Installation

## Usage

```jsx

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>
        {Device.manufacturer}: {Device.modelName}
      </Text>
    </View>
  );
}
```

## API

```js

```

## Error codes

| Code                      | Description                                                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| ERR_DEVICE_ROOT_DETECTION | Error code thrown for `isRootedExperimentalAsync`. This may be thrown if there's no read access to certain system files. |