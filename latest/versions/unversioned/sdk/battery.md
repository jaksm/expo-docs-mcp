---
title: Battery
description: A library that provides battery information for the physical device, as well as corresponding event listeners.
sourceCodeUrl: https://github.com/expo/expo/tree/main/packages/expo-battery
packageName: expo-battery
iconUrl: /static/images/packages/expo-battery.png
platforms: ["android", "ios*", "web"]
---

`expo-battery` provides battery information for the physical device (such as battery level, whether or not the device is charging, and more) as well as corresponding event listeners.

## Installation

## Usage

```jsx

  const batteryLevel = useBatteryLevel();

  return (
    <View style={styles.container}>
      <Text>Current Battery Level: {batteryLevel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## API

```js

```