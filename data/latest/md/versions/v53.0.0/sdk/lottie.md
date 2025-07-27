---
title: lottie-react-native
description: A library that allows rendering After Effects animations.
sourceCodeUrl: https://github.com/lottie-react-native/lottie-react-native
packageName: lottie-react-native
platforms: ["android", "ios", "tvos", "web"]
inExpoGo: true
---

[Lottie](https://airbnb.io/lottie/) renders After Effects animations in real time, allowing apps to use animations as easily as they use static images.

## Installation

## Example

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

## Learn more