---
title: Safe areas
description: Learn how to add safe areas for screen components inside your Expo project.
---

Creating a safe area ensures your app screen's content is positioned correctly. This means it doesn't get overlapped by notches, status bars, home indicators, and other interface elements that are part of the device's physical hardware or are controlled by the operating system. When the content gets overlapped, it gets concealed by these interface elements.

Here's an example of an app screen's content getting concealed by the status bar on Android. On iOS, the same content is concealed by rounded corners, notch, and the status bar.

## Use `react-native-safe-area-context` library

[`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context) provides a flexible API for handling Android and iOS device's safe area insets. It also provides a `SafeAreaView` component that you can use instead of a [``](https://reactnative.dev/docs/view) to account for safe areas automatically in your screen components.

Using the library, the result of the previous example changes as it displays the content inside a safe area, as shown below:

### Installation

You can skip installing `react-native-safe-area-context` if you have created a project using [the default template](/get-started/create-a-project/). This library is installed as peer dependency for Expo Router library. Otherwise, install it by running the following command:

### Usage

You can directly use [`SafeAreaView`](https://github.com/th3rdwave/react-native-safe-area-context#safeareaview) to wrap the content of your screen's component. It is a regular `<View>` with the safe area insets applied as extra padding or margin.

```tsx app/index.tsx

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>Content is in safe area.</Text>
    </SafeAreaView>
  );
}
```

<Collapsible summary="Using a different Expo template and don't have Expo Router installed?">

Import and add [`SafeAreaProvider`](https://github.com/th3rdwave/react-native-safe-area-context#safeareaprovider) to the root component file (such as **App.tsx**) before using `SafeAreaView` in your screen component.

```tsx App.tsx

  return (
    return <SafeAreaProvider>...</SafeAreaProvider>;
  );
}
```

</Collapsible>

## Alternate: `useSafeAreaInsets` hook

Alternate to `SafeAreaView`, you can use [`useSafeAreaInsets`](https://github.com/th3rdwave/react-native-safe-area-context#usesafeareainsets) hook in your screen component. It provides direct access to the safe area insets, allowing you to apply padding for each edge of the `<View>` using an inset from this hook.

The example below uses the `useSafeAreaInsets` hook. It applies top padding to a `<View>` using `insets.top`.

```tsx app/index.tsx

  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <Text>Content is in safe area.</Text>
    
  );
}
```

The hook provides the insets in the following object:

```ts
{
  top: number,
  right: number,
  bottom: number,
  left: number
}
```

## Additional information

### Minimal example

Below is a minimal working example that uses the `useSafeAreaInsets` hook to apply top padding to a view.

```tsx collapseHeight=320

function HomeScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <Text style={{ fontSize: 28 }}>Content is in safe area.</Text>
    </View>
  );
}

  return (
    <SafeAreaProvider>
      
    </SafeAreaProvider>
  );
}
```

### Usage with React Navigation

By default, React Navigation supports safe areas and uses `react-native-safe-area-context` as a peer dependency. For more information, see the [React Navigation documentation](https://reactnavigation.org/docs/handling-safe-area/).

### Usage with web

If you are targeting the web, set up `SafeAreaProvider` as described in the [usage section](#usage). If you are doing server-side rendering (SSR), see the [Web SSR section](https://github.com/th3rdwave/react-native-safe-area-context#web-ssr) in the library's documentation.