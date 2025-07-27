---
title: ImagePicker
description: A library that provides access to the system's UI for selecting images and videos from the phone's library or taking a photo with the camera.
sourceCodeUrl: https://github.com/expo/expo/tree/sdk-53/packages/expo-image-picker
packageName: expo-image-picker
iconUrl: /static/images/packages/expo-image-picker.png
platforms: ["android", "ios", "web"]
searchRank: 8
---

import {
  ConfigReactNative,
  ConfigPluginExample,
  ConfigPluginProperties,
} from '~/ui/components/ConfigSection';

`expo-image-picker` provides access to the system's UI for selecting images and videos from the phone's library or taking a photo with the camera.

## Installation

#### Known issues&ensp;

On iOS, when an image (usually of a [higher resolution](http://www.openradar.me/49866214)) is picked from the camera roll, the result of the cropped image gives the wrong value for the cropped rectangle in some cases. Unfortunately, this issue is with the underlying `UIImagePickerController` due to a bug in the closed-source tools built into iOS.

## Configuration in app config

You can configure `expo-image-picker` using its built-in [config plugin](/config-plugins/introduction/) if you use config plugins in your project ([EAS Build](/build/introduction) or `npx expo run:[android|ios]`). The plugin allows you to configure various properties that cannot be set at runtime and require building a new app binary to take effect.

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you share them with your friends."
        }
      ]
    ]
  }
}
```

If you're not using Continuous Native Generation ([CNG](/workflow/continuous-native-generation/)) or you're using a native **ios** project manually, then you need to add `NSPhotoLibraryUsageDescription`, `NSCameraUsageDescription`, and `NSMicrophoneUsageDescription` keys to your **ios/[app]/Info.plist**:

```xml Info.plist
<key>NSPhotoLibraryUsageDescription</key>
<string>Give $(PRODUCT_NAME) permission to save photos</string>
<key>NSCameraUsageDescription</key>
<string>Give $(PRODUCT_NAME) permission to access your camera</string>
<key>NSMicrophoneUsageDescription</key>
<string>Give $(PRODUCT_NAME) permission to use your microphone</string>
```

## Usage

```tsx

  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      
      {image && }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});
```

When you run this example and pick an image, you will see the image that you picked show up in your app, and a similar log will be shown in the console:

```json collapseHeight=425
{
  "assets": [
    {
      "assetId": "C166F9F5-B5FE-4501-9531",
      "base64": null,
      "duration": null,
      "exif": null,
      "fileName": "IMG.HEIC",
      "fileSize": 6018901,
      "height": 3025,
      "type": "image",
      "uri": "file:///data/user/0/host.exp.exponent/cache/cropped1814158652.jpg"
      "width": 3024
    }
  ],
  "canceled": false
}
```

### With AWS S3

See [Amplify documentation](https://docs.amplify.aws/) guide to set up your project correctly.

### With Firebase

See [Using Firebase](/guides/using-firebase/) guide to set up your project correctly.

## API

```js

```

## Permissions

### Android

The following permissions are added automatically through the library's **AndroidManifest.xml**.

### iOS

The following usage description keys are used by the APIs in this library.