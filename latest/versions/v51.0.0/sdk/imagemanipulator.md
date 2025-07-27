---
title: ImageManipulator
description: A library that provides an API for image manipulation on the local file system.
sourceCodeUrl: https://github.com/expo/expo/tree/sdk-51/packages/expo-image-manipulator
packageName: expo-image-manipulator
iconUrl: /static/images/packages/expo-image-manipulator.png
platforms: ["android", "ios", "web"]
---

`expo-image-manipulator` provides an API to modify images stored on the local file system.

## Installation

## Usage

This will first rotate the image 90 degrees clockwise, then flip the rotated image vertically and save it as a PNG.

```jsx

  const [ready, setReady] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const image = Asset.fromModule(require('./assets/snack-icon.png'));
      await image.downloadAsync();
      setImage(image);
      setReady(true);
    })();
  }, []);

  const _rotate90andFlip = async () => {
    const manipResult = await manipulateAsync(
      image.localUri || image.uri,
      [{ rotate: 90 }, { flip: FlipType.Vertical }],
      { compress: 1, format: SaveFormat.PNG }
    );
    setImage(manipResult);
  };

  const _renderImage = () => (
    <View style={styles.imageContainer}>
      
    </View>
  );

  return (
    <View style={styles.container}>
      {ready && image && _renderImage()}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  imageContainer: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
});
```

## API

```js

```