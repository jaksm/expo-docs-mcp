---
title: VideoThumbnails
description: A library that allows you to generate an image to serve as a thumbnail from a video file.
sourceCodeUrl: https://github.com/expo/expo/tree/sdk-51/packages/expo-video-thumbnails
packageName: expo-video-thumbnails
platforms: ["android", "ios"]
---

`expo-video-thumbnails` allows you to generate an image to serve as a thumbnail from a video file.

## Installation

## Usage

```jsx

  const [image, setImage] = useState(null);

  const generateThumbnail = async () => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
        {
          time: 15000,
        }
      );
      setImage(uri);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <View style={styles.container}>
      
      {image && }
      <Text>{image}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  image: {
    width: 200,
    height: 200,
  },
});
```

## API

```js

```