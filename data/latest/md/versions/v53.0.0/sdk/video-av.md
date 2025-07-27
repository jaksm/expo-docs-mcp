---
title: Video (expo-av)
description: A library that provides an API to implement video playback and recording in apps.
sourceCodeUrl: https://github.com/expo/expo/tree/sdk-53/packages/expo-av
packageName: expo-av
iconUrl: /static/images/packages/expo-av.png
platforms: ["android", "ios", "web"]
isDeprecated: true
---

> **warning** **Deprecated:** The `Video` component from `expo-av`, which is documented on this page, has now been deprecated and replaced by an improved version in `expo-video`. [Learn about `expo-video`](video.md).

The `Video` component from `expo-av` displays a video inline with the other UI elements in your app.

Much of Video and Audio have common APIs that are documented in [AV documentation](av.md). This page covers video-specific props and APIs. We encourage you to skim through this document to get basic video working, and then move on to [AV documentation](av.md) for more advanced functionality. The audio experience of video (such as whether to interrupt music already playing in another app, or whether to play sound while the phone is on silent mode) can be customized using the [Audio API](audio.md).

## Installation

## Usage

Here's a simple example of a video with a play/pause button.

```jsx

  const video = useRef(null);
  const [status, setStatus] = useState({});
  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      <View style={styles.buttons}>
        <Button
          title={status.isPlaying ? 'Pause' : 'Play'}
          onPress={() =>
            status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
          }
        />
      </View>
    </View>
  );
}

/* @hide const styles = StyleSheet.create({ ... }); */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
/* @end */
```

For more advanced examples, check out the [Playlist example](https://github.com/expo/playlist-example/blob/master/App.js), and the [custom `VideoPlayer` controls component](https://github.com/ihmpavel/expo-video-player/blob/master/lib/index.tsx) that wraps `<Video>`, adds custom controls and use the `<Video>` API extensively. The `VideoPlayer` controls is used in [this app](https://github.com/expo/harvard-cs50-app).

## API

```js

```

## Unified API

The rest of the API on the `Video` component `ref` is the same as the API for `Audio.Sound` - see the [AV documentation](av/#playback) for further information.