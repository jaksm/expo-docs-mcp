---
title: TaskManager
description: A library that provides support for tasks that can run in the background.
sourceCodeUrl: https://github.com/expo/expo/tree/sdk-52/packages/expo-task-manager
packageName: expo-task-manager
platforms: ["android", "ios"]
---

`expo-task-manager` provides an API that allows you to manage long-running tasks, in particular those tasks that can run while your app is in the background. Some features of this library are used by other libraries under the hood. Here is a list of Expo SDK libraries that use `TaskManager`.

## Libraries using Expo TaskManager

- [Location](location.md)
- [BackgroundFetch](background-fetch.md)
- [Notifications](notifications.md)

## Installation

## Configuration&ensp;

`TaskManager` works out of the box in the Expo Go app on Android. However, on iOS, you'll need to use a [development build](/develop/development-builds/introduction/).

Standalone apps need some extra configuration: on iOS, each background feature requires a special key in `UIBackgroundModes` array in your **Info.plist** file.

Read more about how to configure this in the reference for each of the [libraries](#libraries-using-expo-taskmanager) that use `TaskManager`.

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