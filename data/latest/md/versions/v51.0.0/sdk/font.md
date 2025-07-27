---
title: Font
description: A library that allows loading fonts at runtime and using them in React Native components.
sourceCodeUrl: https://github.com/expo/expo/tree/sdk-51/packages/expo-font
packageName: expo-font
iconUrl: /static/images/packages/expo-font.png
platforms: ["android", "ios", "tvos", "web"]
---

import {
  ConfigReactNative,
  ConfigPluginExample,
  ConfigPluginProperties,
} from '~/ui/components/ConfigSection';

`expo-font` allows loading fonts from the web and using them in React Native components. See more detailed usage information in the [Fonts](/develop/user-interface/fonts/) guide.

## Installation

## Configuration in app config

You can configure `expo-font` using its built-in [config plugin](/config-plugins/introduction/) if you use config plugins in your project ([EAS Build](/build/introduction) or `npx expo run:[android|ios]`). The plugin allows you to configure various properties that cannot be set at runtime and require building a new app binary to take effect.

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-font",
        {
          "fonts": ["path/to/file.ttf"]
        }
      ]
    ]
  }
}
```

- **Android:** Copy font files to **android/app/src/main/assets/fonts**.
- **iOS**: See [Adding a Custom Font to Your App](https://developer.apple.com/documentation/uikit/adding-a-custom-font-to-your-app) in the Apple Developer documentation.

## Usage

```tsx
/* @info Import useFonts hook from 'expo-font'. */ import { useFonts } from 'expo-font'; /* @end */
/* @info Also, import SplashScreen so that when the fonts are not loaded, we can continue to show SplashScreen. */ import * as SplashScreen from 'expo-splash-screen'; /* @end */

/* @info This prevents SplashScreen from auto hiding while the fonts are loaded. */
SplashScreen.preventAutoHideAsync();
/* @end */

  const [loaded, error] = useFonts({
    'Inter-Black': require('./assets/fonts/Inter-Black.otf'),
  });

  useEffect(() => {
    if (loaded || error) {
      /* @info After the custom fonts have loaded, we can hide the splash screen and display the app screen. */
      SplashScreen.hideAsync();
      /* @end */
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontFamily: 'Inter-Black', fontSize: 30 }}>Inter Black</Text>
      <Text style={{ fontSize: 30 }}>Platform Default</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

## API

```js

```

## Error codes

| Code                | Description                                                       |
| ------------------- | ----------------------------------------------------------------- |
| ERR_FONT_API        | If the arguments passed to `loadAsync` are invalid.               |
| ERR_FONT_SOURCE     | The provided resource was of an incorrect type.                   |
| ERR_WEB_ENVIRONMENT | The browser's `document` element doesn't support injecting fonts. |
| ERR_DOWNLOAD        | Failed to download the provided resource.                         |
| ERR_FONT_FAMILY     | Invalid font family name was provided.                            |
| ERR_UNLOAD          | Attempting to unload fonts that haven't finished loading yet.     |