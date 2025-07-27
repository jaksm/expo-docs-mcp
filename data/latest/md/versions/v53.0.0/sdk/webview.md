---
title: react-native-webview
description: A library that provides a WebView component.
sourceCodeUrl: https://github.com/react-native-webview/react-native-webview
packageName: react-native-webview
platforms: ["android", "ios"]
inExpoGo: true
---

`react-native-webview` provides a `WebView` component that renders web content in a native view.

## Installation

## Usage

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

### With inline HTML

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

## Learn more