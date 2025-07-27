---
title: Drawer
description: Learn how to use the Drawer layout in Expo Router.
---

To use [drawer navigator](https://reactnavigation.org/docs/drawer-based-navigation) you'll need to install some extra dependencies.

## Installation

No additional configuration is required. [Reanimated Babel plugin](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#reanimated-babel-plugin) is automatically configured in `babel-preset-expo` when you install the library.

## Usage

Now you can use the `Drawer` layout to create a drawer navigator. You'll need to wrap the `` in a `` to enable gestures. You only need one `<GestureHandlerRootView>` in your component tree. Any nested routes are not required to be wrapped individually.

```tsx app/_layout.tsx

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      
    
  );
}
```

To edit the drawer navigation menu labels, titles and screen options specific screens are required as follows:

```tsx app/_layout.tsx

  return (
    
      <Drawer>
        
        
      </Drawer>
    
  );
}
```

> **Note:** Be careful when using `react-native-gesture-handler` on the web. It can increase the JavaScript bundle size significantly. Learn more about using [platform-specific modules](/router/advanced/platform-specific-modules/).