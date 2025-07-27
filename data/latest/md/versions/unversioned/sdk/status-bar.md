---
id: statusbar
title: StatusBar
description: A library that provides the same interface as the React Native StatusBar API, but with slightly different defaults to work great in Expo environments.
sourceCodeUrl: https://github.com/expo/expo/tree/main/packages/expo-status-bar
packageName: expo-status-bar
iconUrl: /static/images/packages/expo-status-bar.png
platforms: ["android", "ios", "tvos", "web"]
---

`expo-status-bar` gives you a component and imperative interface to control the app status bar to change its text color, background color, hide it, make it translucent or opaque, and apply animations to any of these changes. Exactly what you are able to do with the `StatusBar` component depends on the platform you're using.

> **tvOS and web support**
>
> For **tvOS**, the `expo-status-bar` code will compile and run, but no status bar will show.
>
> For **web**, there is no API available to control the operating system's status bar, so `expo-status-bar` will do nothing and won't throw an error.

## Installation

## Usage

```jsx collapseHeight=310

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Notice that the status bar has light text!</Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});
```

## API

```js

```