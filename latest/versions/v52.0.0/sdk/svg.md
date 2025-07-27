---
title: React Native SVG
sidebar_title: Svg
description: A library that allows using SVGs in your app.
sourceCodeUrl: https://github.com/react-native-community/react-native-svg
packageName: react-native-svg
platforms: ["android", "ios", "macos", "web", "tvos"]
---

> **info** This library is listed in the Expo SDK reference because it is included in [Expo Go](https://expo.dev/go). You may use any library of your choice with [development builds](/develop/development-builds/introduction/).

`react-native-svg` allows you to use SVGs in your app, with support for interactivity and animation.

## Installation

## API

```js

```

### `Svg`

A set of drawing primitives such as `Circle`, `Rect`, `Path`,
`ClipPath`, and `Polygon`. It supports most SVG elements and properties.
The implementation is provided by [react-native-svg](https://github.com/react-native-community/react-native-svg), and documentation is provided in that repository.

```tsx

  return (
    <Svg height="50%" width="50%" viewBox="0 0 100 100" {...props}>
      
      
    </Svg>
  );
}
```

### Pro tips

Here are some helpful links that will get you moving fast!

- Looking for SVGs? Try the [noun project](https://thenounproject.com/).
- Create or modify your own SVGs for free using [Figma](https://www.figma.com/).
- Optimize your SVG with [SVGOMG](https://jakearchibald.github.io/svgomg/). This will make the code smaller and easier to work with. Be sure not to remove the `viewbox` for best results on Android.
- Convert your SVG to an Expo component in the browser using [React SVGR](https://react-svgr.com/playground/?native=true&typescript=true).