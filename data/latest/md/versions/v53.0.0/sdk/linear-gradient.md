---
title: LinearGradient
description: A universal React component that renders a gradient view.
sourceCodeUrl: https://github.com/expo/expo/tree/sdk-53/packages/expo-linear-gradient
packageName: expo-linear-gradient
iconUrl: /static/images/packages/expo-linear-gradient.png
platforms: ["android", "ios", "tvos", "web"]
---

`expo-linear-gradient` provides a native React view that transitions between multiple colors in a linear direction.

## Installation

## Usage

```tsx

  return (
    <View style={styles.container}>
      
      <LinearGradient
        // Button Linear Gradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.button}>
        <Text style={styles.text}>Sign in with Facebook</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  button: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  text: {
    backgroundColor: 'transparent',
    fontSize: 15,
    color: '#fff',
  },
});
```

## API

```js

```