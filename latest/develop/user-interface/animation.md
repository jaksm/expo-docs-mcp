---
title: Animation
description: Learn how to integrate React Native animations and use it in your Expo project.
---

Animations are a great way to enhance and provide a better user experience. In your Expo projects, you can use the [Animated API](https://reactnative.dev/docs/next/animations) from React Native. However, if you want to use more advanced animations with better performance, you can use the [`react-native-reanimated`](https://docs.swmansion.com/react-native-reanimated/) library. It provides an API that simplifies the process of creating smooth, powerful, and maintainable animations.

## Installation

You can skip installing `react-native-reanimated` if you have created a project using [the default template](/get-started/create-a-project/). This library is already installed. Otherwise, install it by running the following command:

## Usage

### Minimal example

The following example shows how to use the `react-native-reanimated` library to create a simple animation. For more information on the API and advanced usage, see [`react-native-reanimated` documentation](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/your-first-animation).

```tsx
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';

  const randomWidth = useSharedValue(10);

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(randomWidth.value, config),
    };
  });

  return (
    <View style={styles.container}>
      
      <Button
        title="toggle"
        onPress={() => {
          randomWidth.value = Math.random() * 350;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 100,
    height: 80,
    backgroundColor: 'black',
    margin: 30,
  },
});
```

## Other animation libraries

You can use other animation packages such as [Moti](https://moti.fyi/) in your Expo project. It works on Android, iOS, and web.