---
title: React Native WebView
sidebar_title: WebView
description: A library that provides a WebView component.
sourceCodeUrl: https://github.com/react-native-webview/react-native-webview
packageName: react-native-webview
platforms: ["android", "ios"]
---

`react-native-webview` provides a `WebView` component that renders web content in a native view.

## Installation

## Usage

You should refer to the [`react-native-webview` documentation](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md#react-native-webview-guide) for more information on the API and its usage. The following example (courtesy of that repository) is a quick way to get up and running!

{/* prettier-ignore */}
```jsx collapseHeight=310

  return (
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
```

Minimal example with inline HTML:

```jsx collapseHeight=310

  return (
    <WebView
      style={styles.container}
      originWhitelist={['*']}
      source={{ html: '<h1><center>Hello world</center></h1>' }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
```