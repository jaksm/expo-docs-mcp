---
title: MediaLibrary
description: A library that provides access to the device's media library.
sourceCodeUrl: https://github.com/expo/expo/tree/sdk-51/packages/expo-media-library
packageName: expo-media-library
iconUrl: /static/images/packages/expo-media-library.png
platforms: ["android", "ios"]
---

import {
  ConfigReactNative,
  ConfigPluginExample,
  ConfigPluginProperties,
} from '~/ui/components/ConfigSection';

`expo-media-library` provides access to the user's media library, allowing them to access their existing images and videos from your app, as well as save new ones. You can also subscribe to any updates made to the user's media library.

## Installation

## Configuration in app config

You can configure `expo-media-library` using its built-in [config plugin](/config-plugins/introduction/) if you use config plugins in your project ([EAS Build](/build/introduction) or `npx expo run:[android|ios]`). The plugin allows you to configure various properties that cannot be set at runtime and require building a new app binary to take effect.

```json
{
  "expo": {
    "plugins": [
      [
        "expo-media-library",
        {
          "photosPermission": "Allow $(PRODUCT_NAME) to access your photos.",
          "savePhotosPermission": "Allow $(PRODUCT_NAME) to save photos.",
          "isAccessMediaLocationEnabled": true
        }
      ]
    ]
  }
}
```

If you're not using Continuous Native Generation ([CNG](/workflow/continuous-native-generation/)) or you're using native **android** **ios** projects manually, then you need to add following permissions and configuration to your native projects:

**Android**

- To access asset location (latitude and longitude EXIF tags), add `ACCESS_MEDIA_LOCATION` permission to your project's **android/app/src/main/AndroidManifest.xml**:

  ```xml
  <uses-permission android:name="android.permission.ACCESS_MEDIA_LOCATION" />
  ```

- [Scoped storage](https://developer.android.com/training/data-storage#scoped-storage) is available from Android 10. To make `expo-media-library` work with scoped storage, you need to add the following configuration to your **android/app/src/main/AndroidManifest.xml**:

  ```xml
  <manifest ... >
    <application android:requestLegacyExternalStorage="true" ...>
  </manifest>
  ```

**iOS**

- Add `NSPhotoLibraryUsageDescription`, and `NSPhotoLibraryAddUsageDescription` keys to your project's **ios/[app]/Info.plist**:

  ```xml
  <key>NSPhotoLibraryUsageDescription</key>
  <string>Give $(PRODUCT_NAME) permission to access your photos</string>
  <key>NSPhotoLibraryAddUsageDescription</key>
  <string>Give $(PRODUCT_NAME) permission to save photos</string>
  ```

## Usage

{/* prettier-ignore */}
```jsx

  const [albums, setAlbums] = useState(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  async function getAlbums() {
    if (permissionResponse.status !== 'granted') {
      await requestPermission();
    }
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });
    setAlbums(fetchedAlbums);
  }

  return (
    <SafeAreaView style={styles.container}>
      
      <ScrollView>
        {albums && albums.map((album) => )}
      </ScrollView>
    </SafeAreaView>
  );
}

function AlbumEntry({ album }) {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    async function getAlbumAssets() {
      const albumAssets = await MediaLibrary.getAssetsAsync({ album });
      setAssets(albumAssets.assets);
    }
    getAlbumAssets();
  }, [album]);

  return (
    <View key={album.id} style={styles.albumContainer}>
      <Text>
        {album.title} - {album.assetCount ?? 'no'} assets
      </Text>
      <View style={styles.albumAssetsContainer}>
        {assets && assets.map((asset) => (
          
        ))}
      </View>
    </View>
  );
}

/* @hide const styles = StyleSheet.create({ ... }); */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
    ...Platform.select({
      android: {
        paddingTop: 40,
      },
    }),
  },
  albumContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 4,
  },
  albumAssetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
/* @end */
````

## API

```js

```

## Permissions

### Android

The following permissions are added automatically through this library's **AndroidManifest.xml**:

### iOS

The following usage description keys are used by this library: