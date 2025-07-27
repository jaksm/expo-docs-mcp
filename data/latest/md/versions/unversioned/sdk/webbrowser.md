---
title: WebBrowser
description: A library that provides access to the system's web browser and supports handling redirects.
sourceCodeUrl: https://github.com/expo/expo/tree/main/packages/expo-web-browser
packageName: expo-web-browser
iconUrl: /static/images/packages/expo-web-browser.png
platforms: ["android", "ios", "web"]
---

`expo-web-browser` provides access to the system's web browser and supports handling redirects. On Android, it uses `ChromeCustomTabs` and on iOS, it uses `SFSafariViewController` or `ASWebAuthenticationSession`, depending on the method you call. As of iOS 11, `SFSafariViewController` no longer shares cookies with Safari, so if you are using `WebBrowser` for authentication you will want to use `WebBrowser.openAuthSessionAsync`, and if you just want to open a webpage (such as your app privacy policy), then use `WebBrowser.openBrowserAsync`.

## Installation

## Configuration in app config

You can configure `expo-web-browser` using its built-in [config plugin](/config-plugins/introduction/) if you use config plugins in your project ([EAS Build](/build/introduction) or `npx expo run:[android|ios]`). The plugin allows you to configure a property that cannot be set at runtime and require building a new app binary to take effect.

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-web-browser",
        {
          "experimentalLauncherActivity": true
        }
      ]
    ]
  }
}
```

## Usage

```jsx

/* @hide */

/* @end */

  const [result, setResult] = useState(null);

  const _handlePressButtonAsync = async () => {
    let result = await WebBrowser.openBrowserAsync('https://expo.dev');
    setResult(result);
  };
  return (
    <View style={styles.container}>
      
      <Text>{result && JSON.stringify(result)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
});
```

### Handling deep links from the WebBrowser

<Tab label="With Expo Router">

If your project uses Expo Router, deep links are handled automatically.

</Tab>

<Tab label="Without Expo Router">

If you use the `WebBrowser` window for authentication or another use case where you want to pass information back into your app through a deep link, add a handler with `Linking.addEventListener` before opening the browser. When the listener fires, you should call [`dismissBrowser`](#webbrowserdismissbrowser). It will not automatically be dismissed when a deep link is handled. Aside from that, redirects from `WebBrowser` work the same as other deep links. Read more about it in [Linking](/linking/into-your-app/#handle-urls).

</Tab>

## API

```js

```

## Error codes

### `ERR_WEB_BROWSER_REDIRECT`

**Web only:** The window cannot complete the redirect request because the invoking window doesn't have a reference to its parent. This can happen if the parent window was reloaded.

### `ERR_WEB_BROWSER_BLOCKED`

**Web only:** The popup window was blocked by the browser or failed to open. This can happen in mobile browsers when the `window.open()` method was invoked too long after a user input was fired.

Mobile browsers do this to prevent malicious websites from opening many unwanted popups on mobile.

You're method can still run in an async function but there cannot be any long running tasks before it. You can use hooks to disable user-inputs until any other processes have finished loading.

### `ERR_WEB_BROWSER_CRYPTO`

**Web only:** The current environment doesn't support crypto. Ensure you are running from a secure origin (localhost/https).