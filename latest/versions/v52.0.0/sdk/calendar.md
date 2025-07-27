---
title: Calendar
description: A library that provides an API for interacting with the device's system calendars, events, reminders, and associated records.
sourceCodeUrl: https://github.com/expo/expo/tree/sdk-52/packages/expo-calendar
packageName: expo-calendar
platforms: ["android", "ios"]
---

import {
  ConfigReactNative,
  ConfigPluginExample,
  ConfigPluginProperties,
} from '~/ui/components/ConfigSection';

`expo-calendar` provides an API for interacting with the device's system calendars, events, reminders, and associated records.

Additionally, it provides methods to launch the [system-provided calendar UI](#launching-system-provided-calendar-dialogs) to allow user view or edit events. On Android, these methods start the system calendar app using an Intent. On iOS, they present either [`EKEventViewController`](https://developer.apple.com/documentation/eventkitui/ekeventviewcontroller) or [`EKEventEditViewController`](https://developer.apple.com/documentation/eventkitui/ekeventeditviewcontroller) as a modal.

## Installation

## Configuration in app config

You can configure `expo-calendar` using its built-in [config plugin](/config-plugins/introduction/) if you use config plugins in your project ([EAS Build](/build/introduction) or `npx expo run:[android|ios]`). The plugin allows you to configure various properties that cannot be set at runtime and require building a new app binary to take effect.

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-calendar",
        {
          "calendarPermission": "The app needs to access your calendar."
        }
      ]
    ]
  }
}
```

If you're not using Continuous Native Generation ([CNG](/workflow/continuous-native-generation/)) (you're using native **android** and **ios** projects manually), then you need to configure following permissions in your native projects:

- For Android, add `android.permission.READ_CALENDAR` and `android.permission.WRITE_CALENDAR` permissions to your project's **android/app/src/main/AndroidManifest.xml**:

  ```xml
  <uses-permission android:name="android.permission.READ_CALENDAR" />
  <uses-permission android:name="android.permission.WRITE_CALENDAR" />
  ```

- For iOS, add `NSCalendarsUsageDescription` and `NSRemindersUsageDescription` to your project's **ios/[app]/Info.plist**:

  ```xml
  <key>NSCalendarsUsageDescription</key>
  <string>Allow $(PRODUCT_NAME) to access your calendar</string>
  <key>NSRemindersUsageDescription</key>
  <string>Allow $(PRODUCT_NAME) to access your reminders</string>
  ```

## Usage

```jsx

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        console.log('Here are all your calendars:');
        console.log({ calendars });
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Calendar Module Example</Text>
      
    </View>
  );
}

async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
}

async function createCalendar() {
  const defaultCalendarSource =
    Platform.OS === 'ios'
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: 'Expo Calendar' };
  const newCalendarID = await Calendar.createCalendarAsync({
    title: 'Expo Calendar',
    color: 'blue',
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: 'internalCalendarName',
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
  console.log(`Your new calendar ID is: ${newCalendarID}`);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
```

## API

```js

```

## Permissions

### Android

If you only intend to use the [system-provided calendar UI](#launching-system-provided-calendar-dialogs), you don't need to request any permissions.

Otherwise, you must add the following permissions to your **app.json** inside the [`expo.android.permissions`](../config/app/#permissions) array.

### iOS

The following usage description keys are used by this library: