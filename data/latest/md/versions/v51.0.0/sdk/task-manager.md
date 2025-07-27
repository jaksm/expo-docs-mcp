---
title: TaskManager
description: A library that provides support for tasks that can run in the background.
sourceCodeUrl: https://github.com/expo/expo/tree/sdk-51/packages/expo-task-manager
packageName: expo-task-manager
platforms: ["android", "ios"]
---

`expo-task-manager` provides an API that allows you to manage long-running tasks, in particular those tasks that can run while your app is in the background. Some features of this library are used by other libraries under the hood. Here is a list of Expo SDK libraries that use `TaskManager`:

- [Location](location.md)
- [BackgroundFetch](background-fetch.md)
- [Notifications](notifications.md)

## Installation

## Configuration in app config

### Background modes on iOS

`TaskManager` works out of the box in the Expo Go app on Android. However, on iOS, you'll need to use a [development build](/develop/development-builds/introduction/).

Standalone apps need some extra configuration: on iOS, each background feature requires a special key in `UIBackgroundModes` array in your **Info.plist** file. In standalone apps this array is empty by default, so to use background features you will need to add appropriate keys to your **app.json** configuration.

Here is an example of an **app.json** configuration that enables background location, background fetch and remote notifications:

```json app.json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "UIBackgroundModes": ["location", "fetch", "remote-notification"]
      }
    }
  }
}
```

Learn how to configure the native projects in the [installation instructions in the `expo-task-manager` repository](https://github.com/expo/expo/tree/main/packages/expo-task-manager#installation-in-bare-ios-react-native-project).

## Example

```jsx

const LOCATION_TASK_NAME = 'background-location-task';

const requestPermissions = async () => {
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus === 'granted') {
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus === 'granted') {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
      });
    }
  }
};

const PermissionsButton = () => (
  <View style={styles.container}>
    
  </View>
);

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const { locations } = data;
    // do something with the locations captured in the background
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

```

## API

```js

```