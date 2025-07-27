---
title: Video (expo-video)
description: A library that provides an API to implement video playback in apps.
sourceCodeUrl: https://github.com/expo/expo/tree/sdk-51/packages/expo-video
packageName: expo-video
platforms: ["android", "ios", "web"]
---

> **info** `expo-video` is a new, experimental library that aims to replace the `Video` component from `expo-av` with a more modern and reliable implementation. If you are looking for a more stable API, use [`expo-av`](av.md) until this library has stabilized.

> **info** To provide quicker updates, `expo-video` is currently unsupported in Expo Go and Snack. To use it, create a [development build](/develop/development-builds/create-a-build/).

`expo-video` is a cross-platform, performant video component for React Native and Expo with Web support.

## Installation

## Usage

Here's a simple example of a video with a play and pause button.

```jsx

const videoSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  const ref = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    player.play();
  });

  useEffect(() => {
    const subscription = player.addListener('playingChange', isPlaying => {
      setIsPlaying(isPlaying);
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  return (
    <View style={styles.contentContainer}>
      
      <View style={styles.controlsContainer}>
        <Button
          title={isPlaying ? 'Pause' : 'Play'}
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
            setIsPlaying(!isPlaying);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  video: {
    width: 350,
    height: 275,
  },
  controlsContainer: {
    padding: 10,
  },
});
```

## API

```js

```