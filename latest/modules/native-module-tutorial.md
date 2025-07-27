---
title: Tutorial: Create a native module
sidebar_title: Create a native module
description: A tutorial on creating a native module that persists settings with Expo Modules API.
hasVideoLink: true
---

In this tutorial, you build a module that stores the user's preferred app theme: dark, light, or system. On Android, use [`SharedPreferences`](https://developer.android.com/reference/android/content/SharedPreferences), and on iOS, use [`UserDefaults`](https://developer.apple.com/documentation/foundation/userdefaults). You can implement web support with [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), but this tutorial does not cover that.

---

## Initialize a new module

First, create a new module. For this tutorial, the module is named `expo-settings` or `ExpoSettings`. You can choose a different name, but adjust the instructions to match your choice.

> **info** Since you aren't going to actually ship this library, you can hit <kbd>return</kbd> for all the prompts to accept the default values.

## Set up workspace

Clean up the default module to start with a clean slate. Delete the view module since this guide does not use it.

Locate the following files and replace their contents with the provided minimal boilerplate:

```kotlin android/src/main/java/expo/modules/settings/ExpoSettingsModule.kt
package expo.modules.settings

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoSettingsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoSettings")

    Function("getTheme") {
      return@Function "system"
    }
  }
}
```

```swift ios/ExpoSettingsModule.swift
import ExpoModulesCore

public class ExpoSettingsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoSettings")

    Function("getTheme") { () -> String in
      "system"
    }
  }
}
```

```ts src/ExpoSettings.types.ts

```

```ts src/ExpoSettingsModule.ts

declare class ExpoSettingsModule extends NativeModule<ExpoSettingsModuleEvents> {
  getTheme: () => string;
}

// This call loads the native module object from the JSI.

```

```ts src/index.ts

  return ExpoSettingsModule.getTheme();
}
```

```tsx example/App.tsx

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Theme: {Settings.getTheme()}</Text>
    </View>
  );
}
```

## Run the example project

Start the TypeScript compiler to watch for changes.

In a separate terminal window, run the example app.

You should see the text "Theme: system" in the center of the screen when you launch the example app. The value `"system"` comes from synchronously calling the `getTheme()` function in the native module. You will change this value in the next step.

## Get, set, and persist the theme preference value

### Android native module

To read the value, look for a `SharedPreferences` string under the key `"theme"`. If the key does not exist, default to `"system"`. Use the `reactContext` (a React Native [ContextWrapper](https://developer.android.com/reference/android/content/ContextWrapper)) to access the `SharedPreferences` instance with `getSharedPreferences()`.

To set the value, use the `edit()` method of `SharedPreferences` to get an `Editor` instance. Then, use `putString()` to set the value. Ensure the `setTheme` function accepts a value of type `String`.

```kotlin android/src/main/java/expo/modules/settings/ExpoSettingsModule.kt
package expo.modules.settings

import android.content.Context
import android.content.SharedPreferences
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoSettingsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoSettings")

    Function("setTheme") { theme: String ->
      getPreferences().edit().putString("theme", theme).commit()
    }

    Function("getTheme") {
      return@Function getPreferences().getString("theme", "system")
    }
  }

  private val context
  get() = requireNotNull(appContext.reactContext)

  private fun getPreferences(): SharedPreferences {
    return context.getSharedPreferences(context.packageName + ".settings", Context.MODE_PRIVATE)
  }
}
```

### iOS native module

To read the value on iOS, look for a `UserDefaults` string under the key `"theme"`. If the key does not exist, default to `"system"`.

To set the value, use the `set(_:forKey:)` method of `UserDefaults`. Ensure the `setTheme` function accepts a value of type `String`.

```swift ios/ExpoSettingsModule.swift
import ExpoModulesCore

public class ExpoSettingsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoSettings")

    Function("setTheme") { (theme: String) -> Void in
      UserDefaults.standard.set(theme, forKey:"theme")
    }

    Function("getTheme") { () -> String in
      UserDefaults.standard.string(forKey: "theme") ?? "system"
    }
  }
}
```

### TypeScript module

Update the **ExpoSettingsModule.ts** to add a TypeScript interface for the `ExpoSettingsModule` native module to update the theme.

```ts src/ExpoSettingsModule.ts

declare class ExpoSettingsModule extends NativeModule<ExpoSettingsModuleEvents> {
  setTheme: (theme: string) => void;
  getTheme: () => string;
}

// This call loads the native module object from the JSI.

```

Now, call your native modules from TypeScript.

```ts src/index.ts

  return ExpoSettingsModule.getTheme();
}

  return ExpoSettingsModule.setTheme(theme);
}
```

### Example app

You can now use the Settings API in your example app.

```tsx example/App.tsx

  const theme = Settings.getTheme();
  // Toggle between dark and light theme
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Theme: {Settings.getTheme()}</Text>
      <Button title={`Set theme to ${nextTheme}`} onPress={() => Settings.setTheme(nextTheme)} />
    </View>
  );
}
```

When you rebuild and run the app, the "system" theme is still set. Pressing the button does nothing, but when you reload the app, the theme changes. This happens because the app does not fetch the new theme value or re-render. You will fix this in the next step.

## Emit change events for the theme value

Ensure developers using your API can react to theme value changes by emitting a change event whenever the value updates. Use the [Events](/modules/module-api/#events) definition component to describe the events your module emits, `sendEvent` to emit the event from native code, and the [EventEmitter](/modules/module-api/#sending-events) API to subscribe to events in JavaScript. The event payload is `{ theme: string }`.

### Android native module

Events payloads are represented as [`Bundle`](https://developer.android.com/reference/android/os/Bundle.html) instances on Android, which you can create using the [`bundleOf`](<https://developer.android.com/reference/kotlin/androidx/core/os/package-summary#bundleOf(kotlin.Array)>) function.

```kotlin android/src/main/java/expo/modules/settings/ExpoSettingsModule.kt
package expo.modules.settings

import android.content.Context
import android.content.SharedPreferences
import androidx.core.os.bundleOf
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoSettingsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoSettings")

    Events("onChangeTheme")

    Function("setTheme") { theme: String ->
      getPreferences().edit().putString("theme", theme).commit()
      this@ExpoSettingsModule.sendEvent("onChangeTheme", bundleOf("theme" to theme))
    }

    Function("getTheme") {
      return@Function getPreferences().getString("theme", "system")
    }
  }

  private val context
  get() = requireNotNull(appContext.reactContext)

  private fun getPreferences(): SharedPreferences {
    return context.getSharedPreferences(context.packageName + ".settings", Context.MODE_PRIVATE)
  }
}
```

### iOS native module

```swift ios/ExpoSettingsModule.swift
import ExpoModulesCore

public class ExpoSettingsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoSettings")

    Events("onChangeTheme")

    Function("setTheme") { (theme: String) -> Void in
      UserDefaults.standard.set(theme, forKey:"theme")
      sendEvent("onChangeTheme", [
        "theme": theme
      ])
    }

    Function("getTheme") { () -> String in
      UserDefaults.standard.string(forKey: "theme") ?? "system"
    }
  }
}
```

### TypeScript module

```ts src/ExpoSettings.types.ts

  theme: string;
};

  onChangeTheme: (params: ThemeChangeEvent) => void;
};
```

```ts src/index.ts

  return ExpoSettingsModule.addListener('onChangeTheme', listener);
}

  return ExpoSettingsModule.getTheme();
}

  return ExpoSettingsModule.setTheme(theme);
}
```

### Example app

```tsx example/App.tsx

  const [theme, setTheme] = useState<string>(Settings.getTheme());

  useEffect(() => {
    const subscription = Settings.addThemeListener(({ theme: newTheme }) => {
      setTheme(newTheme);
    });

    return () => subscription.remove();
  }, [setTheme]);

  // Toggle between dark and light theme
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Theme: {Settings.getTheme()}</Text>
      <Button title={`Set theme to ${nextTheme}`} onPress={() => Settings.setTheme(nextTheme)} />
    </View>
  );
}
```

## Improve type safety with Enums

It's easy to make mistakes when using the `Settings.setTheme()` API in its current form, as it allows any string value. Improve the type safety of this API by using an enum to restrict the possible values to `system`, `light`, and `dark`.

### Android native module

```kotlin android/src/main/java/expo/modules/settings/ExpoSettingsModule.kt
package expo.modules.settings

import android.content.Context
import android.content.SharedPreferences
import androidx.core.os.bundleOf
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.types.Enumerable

class ExpoSettingsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoSettings")

    Events("onChangeTheme")

    Function("setTheme") { theme: Theme ->
      getPreferences().edit().putString("theme", theme.value).commit()
      this@ExpoSettingsModule.sendEvent("onChangeTheme", bundleOf("theme" to theme.value))
    }

    Function("getTheme") {
      return@Function getPreferences().getString("theme", Theme.SYSTEM.value)
    }
  }

  private val context
  get() = requireNotNull(appContext.reactContext)

  private fun getPreferences(): SharedPreferences {
    return context.getSharedPreferences(context.packageName + ".settings", Context.MODE_PRIVATE)
  }
}

enum class Theme(val value: String) : Enumerable {
  LIGHT("light"),
  DARK("dark"),
  SYSTEM("system")
}
```

### iOS native module

```swift ios/ExpoSettingsModule.swift
import ExpoModulesCore

public class ExpoSettingsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoSettings")

    Events("onChangeTheme")

    Function("setTheme") { (theme: Theme) -> Void in
      UserDefaults.standard.set(theme.rawValue, forKey:"theme")
      sendEvent("onChangeTheme", [
        "theme": theme.rawValue
      ])
    }

    Function("getTheme") { () -> String in
      UserDefaults.standard.string(forKey: "theme") ?? Theme.system.rawValue
    }
  }

  enum Theme: String, Enumerable {
    case light
    case dark
    case system
  }
}
```

### TypeScript module

```ts src/ExpoSettings.types.ts

  theme: Theme;
};

  onChangeTheme: (params: ThemeChangeEvent) => void;
};
```

```ts src/ExpoSettingsModule.ts

declare class ExpoSettingsModule extends NativeModule<ExpoSettingsModuleEvents> {
  setTheme: (theme: Theme) => void;
  getTheme: () => Theme;
}

// This call loads the native module object from the JSI.

```

```ts src/index.ts

  return ExpoSettingsModule.addListener('onChangeTheme', listener);
}

  return ExpoSettingsModule.getTheme();
}

  return ExpoSettingsModule.setTheme(theme);
}
```

### Example app

If you change `Settings.setTheme(nextTheme)` to `Settings.setTheme("not-a-real-theme")`, TypeScript will raise an error. If you ignore the error and press the button, you will see the following runtime error:

```text
 ERROR  Error: FunctionCallException: Calling the 'setTheme' function has failed (at ExpoModulesCore/SyncFunctionComponent.swift:76)
→ Caused by: ArgumentCastException: Argument at index '0' couldn't be cast to type Enum<Theme> (at ExpoModulesCore/JavaScriptUtils.swift:41)
→ Caused by: EnumNoSuchValueException: 'not-a-real-theme' is not present in Theme enum, it must be one of: 'light', 'dark', 'system' (at ExpoModulesCore/Enumerable.swift:37)
```

The last line of the error message shows that `not-a-real-theme` is not a valid value for the `Theme` enum. The only valid values are `light`, `dark`, and `system`.

Congratulations! You have created your first Expo Module for Android and iOS.

## Next steps