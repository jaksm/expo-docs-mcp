---
title: BackgroundTask
description: A library that provides an API for running background tasks.
sourceCodeUrl: https://github.com/expo/expo/tree/sdk-52/packages/expo-background-task
packageName: expo-background-task
platforms: ["android", "ios"]
isNew: true
hasVideoLink: true
---

> **warning** This library is currently in beta and subject to breaking changes.

`expo-background-task` provides an API to run deferrable background tasks in a way that optimizes battery and power consumption on the end user's device. This module uses the [`WorkManager`](https://developer.android.com/topic/libraries/architecture/workmanager) API on Android and the [`BGTaskScheduler`](https://developer.apple.com/documentation/backgroundtasks/bgtaskscheduler) API on iOS to schedule tasks. It also uses the [`expo-task-manager`](task-manager.md) Native API to run JavaScript tasks.

## Background tasks

A background task is a deferrable unit of work that is performed in the background, outside your app's lifecycle. This is useful for tasks that need to be executed when the app is inactive, such as syncing data with a server, fetching new content, or even checking if there are any [`expo-updates`](updates.md).

### When are background tasks run?

The Expo Background Task API leverages each platform to execute tasks at the most optimal time for both the user and the device when the app is in the background.

This means that the task may not run immediately after it is scheduled, but it will run at some point in the future if the system decides so. You can specify a minimum interval in minutes for the task to run. The task will execute sometime after the interval has passed, provided the specified conditions are met.

A background task will only run if the battery has enough charge (or the device is plugged into power) and the network is available. Without these conditions, the task won't execute. The exact behavior will vary depending on the operating system.

### When will they be stopped?

Background tasks are managed by platform APIs and system constraints. Knowing when tasks stop helps plan their use effectively.

- Background tasks are stopped if the user kills the app. Tasks resume when the app is restarted.
- If the system stops the app or the device reboots, background tasks will resume, and the app will be restarted.

On Android, removing an app from the recent apps list doesn't completely stop it, whereas on iOS, swiping it away in the app switcher fully terminates it.

> **Info** On Android, behavior varies by device vendor. For example, some implementations treat removing an app from the recent apps list as killing it. Read more about these differences here: [https://dontkillmyapp.com](https://dontkillmyapp.com).

## Platform differences

### Android&ensp;

On Android, the [`WorkManager`](https://developer.android.com/topic/libraries/architecture/workmanager) API allows specifying a minimum interval for a task to run (minimum 15 minutes). The task will execute sometime after the interval has passed, provided the specified conditions are met.

### iOS&ensp;

On iOS, the [`BGTaskScheduler`](https://developer.apple.com/documentation/backgroundtasks/bgtaskscheduler) API decides the best time to launch your background task. The system will consider the battery level, the network availability, and the user's usage patterns to determine when to run the task. You can still specify a minimum interval for the task to run, but the system may choose to run the task at a later time.

## Known limitations

### iOS&ensp;

The [`Background Tasks`](https://developer.apple.com/documentation/backgroundtasks) API is unavailable on iOS simulators. It is only available when running on a physical device.

## Installation

## Configuration&ensp;

To be able to run background tasks on iOS, you need to add the `processing` value to the `UIBackgroundModes` array in your app's **Info.plist** file. This is required for background fetch to work properly.

**If you're using [CNG](/workflow/continuous-native-generation/)**, the required `UIBackgroundModes` configuration will be applied automatically by prebuild.

If you're not using Continuous Native Generation ([CNG](/workflow/continuous-native-generation/)), then you'll need to add the following to your **Info.plist** file:

```xml ios/project-name/Supporting/Info.plist
<key>UIBackgroundModes</key>
<array>
  <string>processing</string>
</array>
```

## Usage

Below is an example that demonstrates how to use `expo-background-task`.

```tsx App.tsx

const BACKGROUND_TASK_IDENTIFIER = 'background-task';

// Register and create the task so that it is available also when the background task screen
// (a React component defined later in this example) is not visible.
// Note: This needs to be called in the global scope, not in a React component.
TaskManager.defineTask(BACKGROUND_TASK_IDENTIFIER, async () => {
  try {
    const now = Date.now();
    console.log(`Got background task call at date: ${new Date(now).toISOString()}`);
  } catch (error) {
    console.error('Failed to execute the background task:', error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
  return BackgroundTask.BackgroundTaskResult.Success;
});

// 2. Register the task at some point in your app by providing the same name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function registerBackgroundTaskAsync() {
  return BackgroundTask.registerTaskAsync(BACKGROUND_TASK_IDENTIFIER);
}

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background task calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function unregisterBackgroundTaskAsync() {
  return BackgroundTask.unregisterTaskAsync(BACKGROUND_TASK_IDENTIFIER);
}

  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [status, setStatus] = useState<BackgroundTask.BackgroundTaskStatus | null>(null);

  useEffect(() => {
    checkStatusAsync();
  }, []);

  const checkStatusAsync = async () => {
    const status = await BackgroundTask.getStatusAsync();
    setStatus(status);
  };

  const toggle = async () => {
    if (isRegistered) {
      await registerBackgroundTaskAsync();
    } else {
      await unregisterBackgroundTaskAsync();
    }
    setIsRegistered(!isRegistered);
  };

  return (
    
      <View style={styles.textContainer}>
        <Text>
          Background Task Service Availability:{' '}
          <Text style={styles.boldText}>
            {status ? BackgroundTask.BackgroundTaskStatus[status] : null}
          </Text>
        </Text>
      
      
      
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    margin: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
});
```

## Multiple background tasks

Since the Background Tasks API on iOS and the WorkManager API on Android limit the number of tasks that can be scheduled for a single app, Expo Background Task uses a single worker on both platforms. While you can define multiple JavaScript background tasks, they will all run through this single worker.

The last registered background task determines the minimum interval for execution.

## API

```js

```