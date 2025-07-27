---
title: BlurView
description: A React component that blurs everything underneath the view.
sourceCodeUrl: https://github.com/expo/expo/tree/sdk-51/packages/expo-blur
packageName: expo-blur
iconUrl: /static/images/packages/expo-blur.png
platforms: ["android", "ios", "tvos", "web"]
---

A React component that blurs everything underneath the view. Common usage of this is for navigation bars, tab bars, and modals.

> **info** `BlurView` on Android is an experimental feature. To enable it use the [`experimentalBlurMethod`](#experimentalblurmethod) prop.

#### Known issues

The blur effect does not update when `BlurView` is rendered before dynamic content is rendered using, for example, `FlatList`. To fix this, make sure that `BlurView` is rendered after the dynamic content component. For example:

```jsx

  
  

```

## Installation

## Usage

```jsx

  const text = 'Hello, my container is blurring contents underneath!';
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        {[...Array(20).keys()].map(i => (
          
        ))}
      </View>
      <BlurView intensity={100} style={styles.blurContainer}>
        <Text style={styles.text}>{text}</Text>
      </BlurView>
      <BlurView intensity={80} tint="light" style={styles.blurContainer}>
        <Text style={styles.text}>{text}</Text>
      </BlurView>
      <BlurView intensity={90} tint="dark" style={styles.blurContainer}>
        <Text style={[styles.text, { color: '#fff' }]}>{text}</Text>
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
    padding: 20,
    margin: 16,
    textAlign: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 20,
  },
  background: {
    flex: 1,
    flexWrap: 'wrap',
    ...StyleSheet.absoluteFill,
  },
  box: {
    width: '25%',
    height: '20%',
  },
  boxEven: {
    backgroundColor: 'orangered',
  },
  boxOdd: {
    backgroundColor: 'gold',
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
  },
});
```

## API

```js

```

## Using `borderRadius` with `BlurView`

When using `BlurView` on Android and iOS, the `borderRadius` property is not applied when provided explicitly. To fix this, you can use the `overflow: 'hidden'` style since `BlurView` inherits props from `<View>`. See [Usage](#usage) for an example.