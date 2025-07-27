---
title: Lottie
description: A library that allows rendering After Effects animations.
sourceCodeUrl: https://github.com/lottie-react-native/lottie-react-native
packageName: lottie-react-native
platforms: ["android", "ios", "tvos", "web"]
---

> **info** This library is listed in the Expo SDK reference because it is included in [Expo Go](/get-started/set-up-your-environment/). You may use any library of your choice with [development builds](/develop/development-builds/introduction/).

[Lottie](https://airbnb.io/lottie/) renders After Effects animations in real time, allowing apps to use animations as easily as they use static images.

## Installation

## Usage

```tsx

  const animation = useRef<LottieView>(null);
  useEffect(() => {
    // You can control the ref programmatically, rather than using autoPlay
    // animation.current?.play();
  }, []);

  return (
    <View style={styles.animationContainer}>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Restart Animation"
          onPress={() => {
            animation.current?.reset();
            animation.current?.play();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonContainer: {
    paddingTop: 20,
  },
});
```

## API

```js

```

Refer to the [lottie-react-native repository](https://github.com/lottie-react-native/lottie-react-native#usage) for more detailed documentation.