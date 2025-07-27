---
title: ImageManipulator
description: A library that provides an API for image manipulation on the local file system.
sourceCodeUrl: https://github.com/expo/expo/tree/sdk-53/packages/expo-image-manipulator
packageName: expo-image-manipulator
iconUrl: /static/images/packages/expo-image-manipulator.png
platforms: ["android", "ios", "web"]
---

`expo-image-manipulator` provides an API to modify images stored on the local file system.

## Installation

## Usage

This will first rotate the image 90 degrees clockwise, then flip the rotated image vertically and save it as a PNG.

```jsx

const IMAGE = Asset.fromModule(require('./assets/snack-icon.png'));

  const [image, setImage] = useState(IMAGE);
  const context = useImageManipulator(IMAGE.uri);

  const rotate90andFlip = async () => {
    context.rotate(90).flip(FlipType.Vertical);
    const image = await context.renderAsync();
    const result = await image.saveAsync({
      format: SaveFormat.PNG,
    });

    setImage(result);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        
      </View>
      
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