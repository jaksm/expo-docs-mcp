---
title: Audio (expo-av)
description: A library that provides an API to implement audio playback and recording in apps.
sourceCodeUrl: https://github.com/expo/expo/tree/main/packages/expo-av
packageName: expo-av
iconUrl: /static/images/packages/expo-av.png
platforms: ["android", "ios", "tvos", "web"]
isDeprecated: true
---

> **warning** **Deprecated:** The `Audio` component from `expo-av`, which is documented on this page, has now been deprecated and replaced by an improved version in `expo-audio`. [Learn about `expo-audio`](./audio.md).

`Audio` from `expo-av` allows you to implement audio playback and recording in your app.

Note that audio automatically stops if headphones/bluetooth audio devices are disconnected.

See the [playlist example app](https://github.com/expo/playlist-example) for an example on the media playback API, and the [recording example app](https://github.com/expo/audio-recording-example) for an example of the recording API.

## Installation

## Usage

### Playing sounds

```jsx

  const [sound, setSound] = useState();

  async function playSound() {
    console.log('Loading Sound');
    /* @info */ const { sound } = await Audio.Sound.createAsync(
      /* @end */ require('./assets/Hello.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await /* @info */ sound.playAsync(); /* @end */
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          /* @info Always unload the Sound after using it to prevent memory leaks.*/ sound.unloadAsync(); /* @end */
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
});
```

### Recording sounds

```jsx

  const [recording, setRecording] = useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  async function startRecording() {
    try {
      /* @info */ if (permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); /* @end */

      console.log('Starting recording..');
      /* @info */ const { recording } = await Audio.Recording.createAsync(
        /* @end */ Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    /* @info */ await recording.stopAndUnloadAsync(); /* @end */
    /* @info iOS may reroute audio playback to the phone earpiece when recording is allowed, so disable once finished. */ await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    ); /* @end */
    /* @info */ const uri = recording.getURI(); /* @end */
    console.log('Recording stopped and stored at', uri);
  }

  return (
    <View style={styles.container}>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
});
```

### Playing or recording audio in background&ensp;

On iOS, audio playback and recording in background is only available in standalone apps, and it requires some extra configuration.
On iOS, each background feature requires a special key in `UIBackgroundModes` array in your **Info.plist** file.
In standalone apps this array is empty by default, so to use background features you will need to add appropriate keys to your **app.json** configuration.

See an example of **app.json** that enables audio playback in background:

```json
{
  "expo": {
    ...
    "ios": {
      ...
      "infoPlist": {
        ...
        "UIBackgroundModes": [
          "audio"
        ]
      }
    }
  }
}
```

### Notes on web usage

- A MediaRecorder issue on Chrome produces WebM files missing the duration metadata. [See the open Chromium issue](https://bugs.chromium.org/p/chromium/issues/detail?id=642012).
- MediaRecorder encoding options and other configurations are inconsistent across browsers, utilizing a Polyfill such as [kbumsik/opus-media-recorder](https://github.com/kbumsik/opus-media-recorder) or [ai/audio-recorder-polyfill](https://github.com/ai/audio-recorder-polyfill) in your application will improve your experience. Any options passed to `prepareToRecordAsync` will be passed directly to the MediaRecorder API and as such the polyfill.
- Web browsers require sites to be served securely for them to listen to a mic. See [MediaDevices `getUserMedia()` security](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#security) for more details.

## API

```js

```

## Unified API

The rest of the API on the `Sound.Audio` is the same as the API for `Video` component `ref`. See the [AV documentation](av/#playback) for more information.